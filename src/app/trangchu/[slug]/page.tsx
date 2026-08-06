import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import NotionBlocksRenderer from '@/components/notion-blocks-renderer';
import CommentSection from '@/components/comment-section';
import RelatedPosts from '@/components/posts/related-posts';
import VipLockScreen from '@/components/vip-lock-screen';
import { getCurrentUser } from '@/libs/auth-helpers';
import { supabase } from '@/libs/supabase';
import { getAllPostsFromNotion } from '@/services/posts';
import { Post } from '@/types/post';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.SITE_URL || 'https://dohangha.com';

function LoadErrorFallback() {
  return (
    <div className="mx-auto mt-40 text-center">
      <h2 className="mb-4 text-3xl font-bold">Không thể tải dữ liệu lúc này</h2>
      <p className="text-secondary">Vui lòng thử tải lại trang sau ít phút.</p>
    </div>
  );
}

// Trích đoạn văn mở đầu từ nội dung truyện (blocks) để làm mô tả SEO tự
// động cho từng trang -> mỗi truyện có description riêng biệt, không trùng
// lặp, giúp Google hiển thị đoạn trích hấp dẫn thay vì tự chọn ngẫu nhiên.
function extractDescription(blocks: any[], categories: string[]): string {
  const genrePrefix =
    categories && categories.length > 0
      ? `Truyện ${categories.join(', ')}. `
      : '';

  for (const block of blocks || []) {
    if (
      block.type === 'paragraph' &&
      block.paragraph?.rich_text?.length > 0
    ) {
      const text = block.paragraph.rich_text
        .map((t: any) => t.plain_text)
        .join('')
        .trim();

      if (text.length > 0) {
        const combined = `${genrePrefix}${text}`;
        return combined.length > 160
          ? combined.slice(0, 157) + '...'
          : combined;
      }
    }
  }

  return genrePrefix
    ? `${genrePrefix}Đọc truyện online miễn phí, cập nhật liên tục.`
    : 'Đọc truyện online miễn phí, cập nhật liên tục.';
}

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let allPosts;

  try {
    allPosts = await getAllPostsFromNotion();
  } catch (error) {
    console.error('PostPage: failed to fetch posts', error);
    return <LoadErrorFallback />;
  }

  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return notFound();
  }

  if (!post.published) {
    return (
      <article
        data-revalidated-at={new Date().getTime()}
        className="mx-auto mt-40 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold">Post Not Found</h2>
        <Link href="/trangchu">
          <span className="mr-2">&larr;</span>
          <span>Go to list page</span>
        </Link>
      </article>
    );
  }

  const isVip = post.access === 'VIP';

  if (isVip) {
    const user = await getCurrentUser();

    if (!user) {
      return (
        <article className="mt-4 flex flex-col items-center md:mt-20">
          <div className="relative aspect-[3/2] w-[90vw] max-w-[900px] opacity-60 blur-sm">
            <Image
              src={post.cover}
              alt="cover"
              fill
              style={{ objectFit: 'contain' }}
              placeholder="blur"
              blurDataURL={post.blurUrl}
            />
          </div>
          <div className="mx-auto mt-6 max-w-md space-y-4 rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
            <span className="text-4xl">🔒</span>
            <h2 className="text-2xl font-bold">Truyện VIP</h2>
            <p className="text-secondary">
              Đăng nhập hoặc đăng ký tài khoản để nâng cấp VIP và đọc truyện
              này.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/dang-nhap"
                className="rounded-full border border-amber-400 px-6 py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/dang-ky"
                className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        </article>
      );
    }

    if (!user.isVip) {
      return (
        <article className="mt-4 flex flex-col items-center md:mt-20">
          <div className="relative aspect-[3/2] w-[90vw] max-w-[900px] opacity-60 blur-sm">
            <Image
              src={post.cover}
              alt="cover"
              fill
              style={{ objectFit: 'contain' }}
              placeholder="blur"
              blurDataURL={post.blurUrl}
            />
          </div>
          <VipLockScreen />
        </article>
      );
    }
  }

  const relatedPosts: Post[] = allPosts.filter(
    (p) =>
      p.slug !== slug &&
      p.published &&
      p.categories.some((v) => post.categories.includes(v))
  );

  let blocks;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('content')
      .eq('id', post.id)
      .single();

    if (error) throw error;
    blocks = data.content;
  } catch (error) {
    console.error('PostPage: failed to fetch post content', error);
    return <LoadErrorFallback />;
  }

  return (
    <>
      <article
        data-revalidated-at={new Date().getTime()}
        className="mt-4 flex flex-col items-center md:mt-20"
      >
        <div className="relative aspect-[3/2] w-[90vw] max-w-[900px]">
          <Image
            src={post.cover}
            alt="cover"
            fill
            style={{ objectFit: 'contain' }}
            placeholder="blur"
            blurDataURL={post.blurUrl}
          />
        </div>
        <NotionBlocksRenderer blocks={blocks} />
      </article>
      <CommentSection slug={slug} />
      <RelatedPosts posts={relatedPosts} />
    </>
  );
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const allPosts = await getAllPostsFromNotion();
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) return {};

    let description = 'Đọc truyện online miễn phí, cập nhật liên tục.';

    try {
      const { data } = await supabase
        .from('posts')
        .select('content')
        .eq('id', post.id)
        .single();

      if (data?.content) {
        description = extractDescription(data.content, post.categories);
      }
    } catch (err) {
      console.error('generateMetadata: failed to fetch content for description', err);
    }

    const title = `${post.title} - Đọc Truyện Online | Web Truyện`;
    const url = `${SITE_URL}/trangchu/${post.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        images: [
          {
            url: post.cover,
            width: 400,
            height: 300,
          },
        ],
      },
    };
  } catch (error) {
    console.error('generateMetadata: failed to fetch posts', error);
    return {};
  }
}