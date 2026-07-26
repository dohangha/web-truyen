import { NextRequest, NextResponse } from 'next/server';

import { findOrCreateOAuthUser } from '@/libs/users';
import { setSessionCookie } from '@/libs/auth-helpers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.SITE_URL}/dang-nhap?error=1`);
  }

  // Đổi code lấy access_token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.SITE_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${process.env.SITE_URL}/dang-nhap?error=1`);
  }

  // Lấy thông tin người dùng
  const profileRes = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );
  const profile = await profileRes.json();

  if (!profile.email) {
    return NextResponse.redirect(`${process.env.SITE_URL}/dang-nhap?error=1`);
  }

  const user = await findOrCreateOAuthUser(
    profile.email,
    profile.picture,
    'google'
  );

  setSessionCookie(user.id);

  return NextResponse.redirect(`${process.env.SITE_URL}/tai-khoan`);
}
