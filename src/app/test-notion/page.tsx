import { getAllPostsFromNotionV2 } from '@/libs/notion-official';

export default async function TestNotionPage() {
  const posts = await getAllPostsFromNotionV2();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Test Notion API chính thức ({posts.length} truyện)
      </h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-black/10 pb-4">
            <p className="font-semibold">{post.title}</p>
            <p className="text-sm text-gray-500">
              slug: {post.slug} | published: {String(post.published)} |
              access: {post.access} | views: {post.views}
            </p>
            <p className="text-sm text-gray-500">
              categories: {post.categories.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}