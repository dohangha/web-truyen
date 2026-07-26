import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/types/post';

export default function HeroBanner({ post }: { post: Post }) {
  return (
    <section className="relative mb-16 overflow-hidden rounded-2xl">
      <div className="relative aspect-[7/2] w-full sm:aspect-[9/2]">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={post.blurUrl}
        />

        {/* Dải kính mờ chỉ ở phần dưới (nơi có chữ), giữ nguyên màu sắc thật của ảnh phía trên */}
        <div className="absolute inset-x-0 bottom-0 bg-black/70 px-6 py-6 sm:px-10 sm:py-8">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              <span aria-hidden="true">✦</span>
              Truyện Mới Nhất
            </span>

            <h2 className="max-w-2xl text-3xl font-bold leading-tight text-[#F2E9D8] sm:text-5xl">
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-amber-400/40 px-3 py-1 text-xs font-medium text-amber-200"
                >
                  {category}
                </span>
              ))}
              <time className="text-xs text-[#A69C89]">{post.date}</time>
            </div>

            <Link
              href={`/trangchu/${post.slug}`}
              className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-amber-300 transition-all duration-300 hover:bg-amber-400 hover:text-black"
            >
              Đọc Ngay
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
