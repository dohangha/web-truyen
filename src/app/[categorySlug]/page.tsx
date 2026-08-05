import { notFound } from 'next/navigation';

import CategoryFilter from '@/components/filter/category-filter';
import SetCategoryFilter from '@/components/filter/set-category-filter';
import SearchBar from '@/components/filter/search-bar';
import PostsGrid from '@/components/posts/posts-grid';
import { getAllPostsFromNotion } from '@/services/posts';
import { toUniqueArray } from '@/utils/to-unique-array';

const CATEGORY_MAP: Record<string, string> = {
  trinhtham: 'Trinh Thám',
  codai: 'Cổ Đại',
  hiendai: 'Hiện Đại',
  ngontinh: 'Ngôn Tình',
};

// Cache dữ liệu Notion trong 1 giờ, đồng bộ với /trangchu
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string };
}) {
  const categoryName = CATEGORY_MAP[params.categorySlug];

  return {
    title: categoryName ?? 'Không tìm thấy',
    description: categoryName
      ? `Danh sách truyện thể loại ${categoryName}.`
      : undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const categoryName = CATEGORY_MAP[params.categorySlug];

  if (!categoryName) {
    notFound();
  }

  const allPosts = await getAllPostsFromNotion();

  const allCategories = toUniqueArray(
    allPosts
      .filter((post) => post.published)
      .map((post) => post.categories)
      .flat()
  ).sort();

  return (
    <>
      <SetCategoryFilter category={categoryName} />
      <section className="mb-16 mt-0 space-y-8 md:mt-20">
        <SearchBar />
        <CategoryFilter allCategories={allCategories} />
      </section>
      <PostsGrid allPosts={allPosts} />
    </>
  );
}
