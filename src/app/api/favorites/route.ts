import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/auth-helpers';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ favorites: [] }, { status: 200 });
  }

  return NextResponse.json({ favorites: user.favorites });
}
