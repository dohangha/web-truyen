import { Post } from '@/types/post';

export function getRecommendedPosts(
  allPosts: Post[],
  favoriteSlugs: string[],
  limit = 8
): Post[] {
  if (favoriteSlugs.length === 0) return [];

  const favoritedPosts = allPosts.filter((p) => favoriteSlugs.includes(p.slug));

  // Đếm tần suất thể loại xuất hiện trong các truyện đã thích
  const categoryCount: Record<string, number> = {};
  favoritedPosts.forEach((post) => {
    post.categories.forEach((category) => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const candidates = allPosts.filter(
    (post) => post.published && !favoriteSlugs.includes(post.slug)
  );

  // Chấm điểm mỗi truyện theo số thể loại trùng với sở thích
  const scored = candidates.map((post) => {
    const score = post.categories.reduce(
      (sum, category) => sum + (categoryCount[category] || 0),
      0
    );
    return { post, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}
