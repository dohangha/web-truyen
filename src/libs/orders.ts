import { randomInt } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

interface Order {
  code: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid';
  createdAt: number;
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function createOrder(userId: string): Promise<Order> {
  const orders = await readOrders();

  const code = `VIP${randomInt(100000, 999999)}`;
  const amount = Number(process.env.VIP_PRICE) || 49000;

  const order: Order = {
    code,
    userId,
    amount,
    status: 'pending',
    createdAt: Date.now(),
  };

  orders.push(order);
  await writeOrders(orders);

  return order;
}

export async function getOrder(code: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.code === code);
}

export async function markOrderPaid(code: string): Promise<Order | null> {
  const orders = await readOrders();
  const order = orders.find((o) => o.code === code);

  if (!order || order.status === 'paid') return null;

  order.status = 'paid';
  await writeOrders(orders);

  return order;
}

export async function getPendingOrderForUser(
  userId: string
): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((o) => o.userId === userId && o.status === 'pending');
}

export async function getPendingOrders(): Promise<Order[]> {
  const orders = await readOrders();
  return orders
    .filter((o) => o.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function findPendingOrderByContent(
  content: string
): Promise<Order | undefined> {
  const orders = await readOrders();
  const upperContent = content.toUpperCase();

  return orders.find(
    (o) => o.status === 'pending' && upperContent.includes(o.code)
  );
}
