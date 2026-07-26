import { NextRequest, NextResponse } from 'next/server';

import { verifyPassword } from '@/libs/users';
import { setSessionCookie } from '@/libs/auth-helpers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await verifyPassword(email || '', password || '');

  if (!user) {
    return NextResponse.json(
      { error: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    );
  }

  setSessionCookie(user.id);

  return NextResponse.json({ success: true });
}
