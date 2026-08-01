import { MetadataRoute } from 'next';

import { getAllPostsFromNotion } from '@/services/posts';

const SITE_URL = process.env.SITE_URL || 'https://dohangha.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPostsFromNotion();
  const publishedPosts = allPosts.filter((post) => post.published);

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

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${SITE_URL}/trangchu/${post.slug}`,
    lastModified: new Date(post.lastEditedAt),
  }));

  return [...staticRoutes, ...postRoutes];
}
