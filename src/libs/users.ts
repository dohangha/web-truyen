import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash?: string; // không có nếu đăng nhập qua Google/Facebook
  avatarUrl?: string;
  provider: 'email' | 'google' | 'facebook';
  isVip: boolean;
  favorites: string[];
  createdAt: number;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    return users.map((u: User) => ({
      favorites: [],
      provider: 'email',
      ...u,
    }));
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    provider: 'email',
    isVip: false,
    favorites: [],
    createdAt: Date.now(),
  };

  users.push(user);
  await writeUsers(users);

  return user;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase());

  if (!user || !user.passwordHash) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  return isMatch ? user : null;
}

// Đăng nhập qua Google/Facebook: tìm tài khoản theo email, nếu chưa có thì tạo mới
export async function findOrCreateOAuthUser(
  email: string,
  avatarUrl: string | undefined,
  provider: 'google' | 'facebook'
): Promise<User> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find((u) => u.email === normalizedEmail);
  if (existing) return existing;

  const user: User = {
    id: randomUUID(),
    email: normalizedEmail,
    avatarUrl,
    provider,
    isVip: false,
    favorites: [],
    createdAt: Date.now(),
  };

  users.push(user);
  await writeUsers(users);

  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function setUserVip(id: string): Promise<void> {
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  if (user) {
    user.isVip = true;
    await writeUsers(users);
  }
}

export async function toggleFavorite(
  userId: string,
  slug: string
): Promise<string[] | null> {
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) return null;

  if (user.favorites.includes(slug)) {
    user.favorites = user.favorites.filter((s) => s !== slug);
  } else {
    user.favorites.push(slug);
  }

  await writeUsers(users);
  return user.favorites;
}

export async function getStats(): Promise<{
  totalUsers: number;
  totalVip: number;
}> {
  const users = await readUsers();
  return {
    totalUsers: users.length,
    totalVip: users.filter((u) => u.isVip).length,
  };
}
