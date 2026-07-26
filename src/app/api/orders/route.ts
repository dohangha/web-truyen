import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/auth-helpers';
import { createOrder } from '@/libs/orders';
import { sendOrderNotification } from '@/libs/notify';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Vui lòng đăng nhập trước khi nâng cấp' },
      { status: 401 }
    );
  }

  const order = await createOrder(user.id);

  sendOrderNotification({ ...order, email: user.email });

  return NextResponse.json({
    code: order.code,
    amount: order.amount,
  });
}
