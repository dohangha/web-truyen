import { NextRequest, NextResponse } from 'next/server';

import { markOrderPaid } from '@/libs/orders';
import { setUserVip } from '@/libs/users';

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const password = request.headers.get('x-admin-password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await markOrderPaid(params.code);

  if (!order) {
    return NextResponse.json(
      { error: 'Không tìm thấy đơn hoặc đã xác nhận rồi' },
      { status: 404 }
    );
  }

  // Nâng tài khoản gắn với đơn hàng này lên VIP
  await setUserVip(order.userId);

  return NextResponse.json({ success: true });
}
