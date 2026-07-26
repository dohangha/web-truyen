import { createHmac } from 'crypto';

const SECRET = process.env.UNLOCK_SECRET || 'change-this-secret';

// Cookie này là MỞ KHOÁ TOÀN SITE (không gắn với 1 truyện cụ thể) -
// đúng với mô hình "nâng cấp thành viên VIP" trả 1 lần, đọc mọi truyện VIP.
export function signUnlock(): string {
  const value = 'unlocked';
  const signature = createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${signature}`;
}

export function verifyUnlock(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;

  const [value, signature] = cookieValue.split('.');
  if (!value || !signature) return false;

  const expectedSignature = createHmac('sha256', SECRET)
    .update(value)
    .digest('hex');

  return signature === expectedSignature && value === 'unlocked';
}
