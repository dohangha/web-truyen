import { NotionAPI } from 'notion-client';
import { Block } from 'notion-types';

const notion = new NotionAPI({
  authToken: process.env.NOTION_AUTH_TOKEN,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRecordMap(id: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await notion.getPage(id);
    } catch (error) {
      const isLastAttempt = attempt === retries;

      console.error(
        `getRecordMap failed for "${id}" (attempt ${attempt}/${retries})`,
        error
      );

      if (isLastAttempt) {
        throw error;
      }

      // Chờ tăng dần trước khi thử lại: 1s, 2s, 3s...
      // giúp tránh bị Notion rate-limit khi build nhiều trang cùng lúc.
      await delay(attempt * 1000);
    }
  }

  // Về lý thuyết không bao giờ tới đây vì đã throw ở lần cuối
  throw new Error(`getRecordMap: exhausted retries for "${id}"`);
}

export function mapImageUrl(url: string, block: Block): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('data:')) {
    return url;
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith('https://images.unsplash.com')) {
    return url;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      if (
        u.searchParams.has('X-Amz-Credential') &&
        u.searchParams.has('X-Amz-Signature') &&
        u.searchParams.has('X-Amz-Algorithm')
      ) {
        // if the URL is already signed, then use it as-is
        return url;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = block.parent_table === 'space' ? 'block' : block.parent_table;
  if (table === 'collection' || table === 'team') {
    table = 'block';
  }
  notionImageUrlV2.searchParams.set('table', table);
  notionImageUrlV2.searchParams.set('id', block.id);
  notionImageUrlV2.searchParams.set('cache', 'v2');

  url = notionImageUrlV2.toString();

  return url;
}