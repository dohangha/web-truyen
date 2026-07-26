'use client';

import Link from 'next/link';

import PostCard from '@/components/posts/post-card';
import { Post } from '@/types/post';

export default function HomeSection({
  title,
  posts,
  viewAllHref,
}: {
  title: string;
  posts: Post[];
  viewAllHref?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-secondary hover:text-primary text-sm font-medium transition-colors duration-300"
          >
            Xem tất cả →
          </Link>
        )}
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2">
        {posts.map((post) => (
          <div key={post.slug} className="w-64 shrink-0 snap-start sm:w-72">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
