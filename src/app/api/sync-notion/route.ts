import { NextRequest, NextResponse } from 'next/server';

import { syncNotionToSupabase } from '@/libs/sync-notion-to-supabase';

export const maxDuration = 300; // 5 phút - đồng bộ nhiều truyện có thể mất thời gian
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncNotionToSupabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}