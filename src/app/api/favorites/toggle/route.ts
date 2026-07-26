import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/auth-helpers';
import { toggleFavorite } from '@/libs/users';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Vui lòng đăng nhập' },
      { status: 401 }
    );
  }

  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 });
  }

  const favorites = await toggleFavorite(user.id, slug);

  return NextResponse.json({ favorites });
}
