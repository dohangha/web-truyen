import { getBlurImage } from '@/utils/get-blur-image';
import { supabase } from './supabase';
import { notion } from './notion-official';
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;

function isFullPage(page: { object: string }): page is PageObjectResponse {
  return page.object === 'page' && 'properties' in page;
}

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties['Page'];
  if (prop?.type !== 'title') return '';
  return prop.title.map((t) => t.plain_text).join('');
}

function getRichText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (prop?.type !== 'rich_text') return '';
  return prop.rich_text.map((t) => t.plain_text).join('');
}

function getCoverUrl(page: PageObjectResponse): string {
  const prop = page.properties['Cover'];
  if (prop?.type !== 'files' || prop.files.length === 0) return '';
  const file = prop.files[0];
  if (file.type === 'file') return file.file.url;
  if (file.type === 'external') return file.external.url;
  return '';
}

function getMultiSelect(page: PageObjectResponse, name: string): string[] {
  const prop = page.properties[name];
  if (prop?.type !== 'multi_select') return [];
  return prop.multi_select.map((o) => o.name);
}

function getCheckbox(page: PageObjectResponse, name: string): boolean {
  const prop = page.properties[name];
  if (prop?.type !== 'checkbox') return false;
  return prop.checkbox;
}

function getSelect(
  page: PageObjectResponse,
  name: string
): string | undefined {
  const prop = page.properties[name];
  if (prop?.type !== 'select') return undefined;
  return prop.select?.name;
}

function getNumber(page: PageObjectResponse, name: string): number {
  const prop = page.properties[name];
  if (prop?.type !== 'number') return 0;
  return prop.number ?? 0;
}

async function fetchPageBlocks(
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if ('type' in block) {
        const fullBlock = block as BlockObjectResponse;

        if (fullBlock.has_children) {
          (fullBlock as any).children = await fetchPageBlocks(fullBlock.id);
        }

        blocks.push(fullBlock);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

// Tải ảnh bìa từ Notion (link tạm 1 giờ) về, upload lên Supabase Storage
// (link vĩnh viễn) -> web không còn phụ thuộc link tạm của Notion nữa.
async function uploadCoverToStorage(
  coverUrl: string,
  postId: string
): Promise<string> {
  if (!coverUrl) return '';

  const res = await fetch(coverUrl);
  if (!res.ok) throw new Error(`Failed to download cover: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.split('/')[1] || 'jpg';
  const path = `${postId}.${ext}`;

  const { error } = await supabase.storage
    .from('post-covers')
    .upload(path, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('post-covers').getPublicUrl(path);

  return data.publicUrl;
}

export type SyncResult = {
  synced: number;
  failed: { slug: string; error: string }[];
};

export async function syncNotionToSupabase(): Promise<SyncResult> {
  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (isFullPage(page)) {
        allPages.push(page);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  const failed: { slug: string; error: string }[] = [];
  let synced = 0;

  // Đồng bộ tuần tự (không song song) để tránh vượt rate limit của Notion
  // (khoảng 3 request/giây) trong lúc đồng bộ nhiều truyện cùng lúc.
  for (const page of allPages) {
    const slug = getRichText(page, 'Slug');

    try {
      const rawCover = getCoverUrl(page);
      const storedCover = await uploadCoverToStorage(rawCover, page.id);
      const blurUrl = storedCover
        ? (await getBlurImage(storedCover)).base64
        : '';

      const blocks = await fetchPageBlocks(page.id);

      const { error } = await supabase.from('posts').upsert({
        id: page.id,
        title: getTitle(page),
        slug,
        categories: getMultiSelect(page, 'Category'),
        cover: storedCover,
        blur_url: blurUrl,
        date: '',
        published: getCheckbox(page, 'Published'),
        last_edited_at: new Date(page.last_edited_time).getTime(),
        views: getNumber(page, 'Lượt Xem'),
        status: getSelect(page, 'Trạng Thái'),
        access: getSelect(page, 'Truy Cập'),
        content: blocks,
        synced_at: new Date().toISOString(),
      });

      if (error) throw error;

      synced++;
    } catch (err) {
      failed.push({
        slug: slug || page.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { synced, failed };
}