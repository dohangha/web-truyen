import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { unstable_cache } from 'next/cache';

import { Post } from '@/types/post';
import { getBlurImage } from '@/utils/get-blur-image';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;

const REVALIDATE_SECONDS = 300; // 5 phút

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

async function fetchAllPostsFromNotion(): Promise<Post[]> {
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
        allPages.push(page as PageObjectResponse);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  const posts: Post[] = allPages.map((page) => ({
    id: page.id,
    title: getTitle(page),
    slug: getRichText(page, 'Slug'),
    categories: getMultiSelect(page, 'Category'),
    cover: getCoverUrl(page),
    date: '',
    published: getCheckbox(page, 'Published'),
    lastEditedAt: new Date(page.last_edited_time).getTime(),
    views: getNumber(page, 'Lượt Xem'),
    status: getSelect(page, 'Trạng Thái'),
    access: getSelect(page, 'Truy Cập'),
  }));

  const blurImagesPromises = posts.map((post) => getBlurImage(post.cover));
  const blurImages = await Promise.all(blurImagesPromises);
  posts.forEach((post, i) => (post.blurUrl = blurImages[i].base64));

  return posts;
}

export async function getAllPostsFromNotionV2(): Promise<Post[]> {
  const cached = unstable_cache(
    fetchAllPostsFromNotion,
    ['all-posts-from-notion-v2'],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ['notion-posts'],
    }
  );

  return cached();
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

        // Nếu block có block con (ví dụ mục con trong danh sách lồng nhau),
        // lấy đệ quy để không bị thiếu nội dung.
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

export async function getPageBlocksV2(
  pageId: string
): Promise<BlockObjectResponse[]> {
  const cached = unstable_cache(fetchPageBlocks, ['page-blocks-v2'], {
    revalidate: REVALIDATE_SECONDS,
    tags: ['notion-posts', `notion-page-${pageId}`],
  });

  return cached(pageId);
}