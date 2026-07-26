import { NextRequest, NextResponse } from 'next/server';

import { getPendingOrders } from '@/libs/orders';
import { getUserById } from '@/libs/users';

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await getPendingOrders();

  // Gắn kèm email người dùng để dễ đối chiếu
  const ordersWithEmail = await Promise.all(
    orders.map(async (order) => {
      const user = await getUserById(order.userId);
      return { ...order, email: user?.email };
    })
  );

  return NextResponse.json({ orders: ordersWithEmail });
}
