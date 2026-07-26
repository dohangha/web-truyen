import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/auth-helpers';
import { addComment, getCommentsForSlug } from '@/libs/comments';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 });
  }

  const comments = await getCommentsForSlug(slug);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Vui lòng đăng nhập để bình luận' },
      { status: 401 }
    );
  }

  const { slug, content } = await request.json();

  if (!slug || !content || !content.trim()) {
    return NextResponse.json(
      { error: 'Nội dung bình luận không được để trống' },
      { status: 400 }
    );
  }

  const comment = await addComment(slug, user.id, user.email, content);

  return NextResponse.json({ comment });
}
