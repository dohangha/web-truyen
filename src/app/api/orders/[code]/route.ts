import { NextRequest, NextResponse } from 'next/server';

import { getOrder } from '@/libs/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const order = await getOrder(params.code);

  if (!order) {
    return NextResponse.json({ error: 'Không tìm thấy đơn' }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
