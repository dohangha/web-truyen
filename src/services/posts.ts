import { supabase } from '@/libs/supabase';
import { Post } from '@/types/post';

export async function getAllPostsFromNotion(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, categories, cover, blur_url, date, published, last_edited_at, views, status, access');

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    categories: row.categories,
    cover: row.cover,
    blurUrl: row.blur_url,
    date: row.date,
    published: row.published,
    lastEditedAt: row.last_edited_at,
    views: row.views,
    status: row.status,
    access: row.access,
  }));
}