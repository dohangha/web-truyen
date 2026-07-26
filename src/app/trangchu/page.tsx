import CategoryFilter from '@/components/filter/category-filter';
import SearchBar from '@/components/filter/search-bar';
import HeroBanner from '@/components/hero/hero-banner';
import HomeSection from '@/components/home/home-section';
import PostsGrid from '@/components/posts/posts-grid';
import { getAllPostsFromNotion } from '@/services/posts';
import { toUniqueArray } from '@/utils/to-unique-array';

export const metadata = {
  title: 'Trang Chủ',
  description: 'All posts are created by notion ai.',
};

export const revalidate = 3600;

export default async function BlogPage() {
  const allPosts = await getAllPostsFromNotion();
  const publishedPosts = allPosts.filter((post) => post.published);

  // Dùng lastEditedAt (có cả giờ/giây) thay vì date (chỉ có ngày) để tránh
  // các truyện đăng cùng ngày bị xếp thứ tự sai/ngẫu nhiên.
  const sortedByRecent = [...publishedPosts].sort(
    (a, b) => b.lastEditedAt - a.lastEditedAt
  );

  const featuredPost = sortedByRecent[0];
  const recentPosts = sortedByRecent
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 4);

  const allCategories = toUniqueArray(
    publishedPosts.map((post) => post.categories).flat()
  ).sort();

  return (
    <>
      {featuredPost && <HeroBanner post={featuredPost} />}

      <HomeSection title="✦ Truyện Mới Cập Nhật" posts={recentPosts} />

      <section className="mb-10 space-y-6">
        <h2 className="text-2xl font-bold">🔍 Duyệt Tất Cả Truyện</h2>
        <SearchBar />
        <CategoryFilter allCategories={allCategories} />
      </section>

      <PostsGrid allPosts={allPosts} />
    </>
  );
}
