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

  let allPosts;

  try {
    allPosts = await getAllPostsFromNotion();
  } catch (error) {
    console.error('CategoryPage: failed to fetch posts from Notion', error);

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