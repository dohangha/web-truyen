'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineEye } from 'react-icons/ai';

import CategoryList from '@/components/category-list';
import FavoriteButton from '@/components/favorite-button';
import { Post } from '@/types/post';

const STATUS_STYLES: Record<string, string> = {
  'Đang Ra': 'bg-emerald-500 text-white',
  Full: 'bg-blue-500 text-white',
};

function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return `${views}`;
}

export default function PostCard({
  post: { slug, title, date, cover, categories, blurUrl, views, status, access },
}: {
  post: Post;
}) {
  return (
    <Link href={`/trangchu/${slug}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)]">
        <div className="relative aspect-[3/4] shrink-0 overflow-hidden sm:aspect-video">
          <Image
            src={cover}
            alt="cover image"
            fill
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL={blurUrl}
            className="transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          {status && (
            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ${
                STATUS_STYLES[status] ?? 'bg-gray-700 text-white'
              }`}
            >
              {status}
            </span>
          )}

          {access === 'VIP' && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              🔒 VIP
            </span>
          )}

          <div className="absolute bottom-2 right-2 scale-90">
            <FavoriteButton slug={slug} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 sm:text-base">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <time>{date}</time>
            <span className="flex items-center gap-0.5">
              <AiOutlineEye />
              {formatViews(views)}
            </span>
          </div>
          <div className="mt-auto scale-90 origin-left pt-1">
            <CategoryList categories={categories} max={2} />
          </div>
        </div>
      </article>
    </Link>
  );
}
