import { NextRequest, NextResponse } from 'next/server';

import { findOrCreateOAuthUser } from '@/libs/users';
import { setSessionCookie } from '@/libs/auth-helpers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.SITE_URL}/dang-nhap?error=1`);
  }

  const redirectUri = `${process.env.SITE_URL}/api/auth/facebook/callback`;

  // Đổi code lấy access_token
  const tokenParams = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID!,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
    redirect_uri: redirectUri,
    code,
  });

  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`
  );
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${process.env.SITE_URL}/dang-nhap?error=1`);
  }

  // Lấy thông tin người dùng
  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
  );
  const profile = await profileRes.json();

  if (!profile.email) {
    // Facebook có thể không trả email nếu người dùng không cấp quyền
    return NextResponse.redirect(
      `${process.env.SITE_URL}/dang-nhap?error=no_email`
    );
  }

  const user = await findOrCreateOAuthUser(
    profile.email,
    profile.picture?.data?.url,
    'facebook'
  );

  setSessionCookie(user.id);

  return NextResponse.redirect(`${process.env.SITE_URL}/tai-khoan`);
}
