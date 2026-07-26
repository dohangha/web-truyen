import { cookies } from 'next/headers';

import { getUserById, User } from '@/libs/users';
import { signSession, verifySession } from '@/libs/session';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = verifySession(cookieStore.get('session')?.value);

  if (!userId) return null;

  const user = await getUserById(userId);
  return user ?? null;
}

// Chỉ gọi được trong Route Handler (API route) hoặc Server Action, không gọi
// được trong Server Component thông thường.
export function setSessionCookie(userId: string) {
  cookies().set('session', signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
