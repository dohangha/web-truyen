import { MetadataRoute } from 'next';

import { getAllPostsFromNotion } from '@/services/posts';

const SITE_URL = process.env.SITE_URL || 'https://dohangha.com';

export const dynamic = 'force-dynamic';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL },
  { url: `${SITE_URL}/trangchu` },
  { url: `${SITE_URL}/trinhtham` },
  { url: `${SITE_URL}/codai` },
  { url: `${SITE_URL}/hiendai` },
  { url: `${SITE_URL}/ngontinh` },
  { url: `${SITE_URL}/about` },
  { url: `${SITE_URL}/contact` },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const allPosts = await getAllPostsFromNotion();
    const publishedPosts = allPosts.filter((post) => post.published);

    const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
      url: `${SITE_URL}/trangchu/${post.slug}`,
      lastModified: new Date(post.lastEditedAt),
    }));

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error('sitemap: failed to fetch posts from Notion', error);

    return staticRoutes;
  }
}