import { NextRequest, NextResponse } from 'next/server';

import { createUser } from '@/libs/users';
import { setSessionCookie } from '@/libs/auth-helpers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: 'Email và mật khẩu (tối thiểu 6 ký tự) là bắt buộc' },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  if (!user) {
    return NextResponse.json(
      { error: 'Email này đã được đăng ký' },
      { status: 409 }
    );
  }

  setSessionCookie(user.id);

  return NextResponse.json({ success: true });
}
