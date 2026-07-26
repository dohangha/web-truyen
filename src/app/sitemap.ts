import { MetadataRoute } from 'next';

import { getAllPostsFromNotion } from '@/services/posts';

const SITE_URL = process.env.SITE_URL || 'https://dohangha.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPostsFromNotion();
  const publishedPosts = allPosts.filter((post) => post.published);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    {
      url: `${SITE_URL}/trangchu`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/trinhtham`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    { url: `${SITE_URL}/codai`, changeFrequency: 'daily', priority: 0.8 },
    {
      url: `${SITE_URL}/hiendai`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ngontinh`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${SITE_URL}/trangchu/${post.slug}`,
    lastModified: new Date(post.lastEditedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
