import { createHmac } from 'crypto';

// Dùng chung UNLOCK_SECRET đã có sẵn để ký cả session đăng nhập
const SECRET = process.env.UNLOCK_SECRET || 'change-this-secret';

export function signSession(userId: string): string {
  const signature = createHmac('sha256', SECRET).update(userId).digest('hex');
  return `${userId}.${signature}`;
}

export function verifySession(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;

  const lastDotIndex = cookieValue.lastIndexOf('.');
  if (lastDotIndex === -1) return null;

  const userId = cookieValue.slice(0, lastDotIndex);
  const signature = cookieValue.slice(lastDotIndex + 1);

  const expectedSignature = createHmac('sha256', SECRET)
    .update(userId)
    .digest('hex');

  return signature === expectedSignature ? userId : null;
}
