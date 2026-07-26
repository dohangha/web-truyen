import { NextRequest, NextResponse } from 'next/server';

import { getStats } from '@/libs/users';

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getStats();
  return NextResponse.json(stats);
}
