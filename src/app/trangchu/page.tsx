import CategoryFilter from '@/components/filter/category-filter';
import SearchBar from '@/components/filter/search-bar';
import HeroBanner from '@/components/hero/hero-banner';
import HomeSection from '@/components/home/home-section';
import PostsGrid from '@/components/posts/posts-grid';
import { getAllPostsFromNotion } from '@/services/posts';
import { toUniqueArray } from '@/utils/to-unique-array';

export const metadata = {
  title: 'Đọc Truyện Online Miễn Phí | Ngôn Tình, Trinh Thám, Cổ Đại',
  description:
    'Đọc truyện online miễn phí mỗi ngày: ngôn tình, trinh thám, cổ đại, hiện đại. Cập nhật truyện mới liên tục, giao diện đẹp, đọc mượt trên mọi thiết bị.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let allPosts;

  try {
    allPosts = await getAllPostsFromNotion();
  } catch (error) {
    console.error('BlogPage: failed to fetch posts from Notion', error);

    return (
      <div className="mx-auto mt-40 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Không thể tải dữ liệu lúc này
        </h2>
        <p className="text-secondary">
          Vui lòng thử tải lại trang sau ít phút.
        </p>
      </div>
    );
  }

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