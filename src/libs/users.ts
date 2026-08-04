import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

import { supabase } from '@/libs/supabase';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  provider: 'email' | 'google' | 'facebook';
  isVip: boolean;
  favorites: string[];
  createdAt: number;
}

// Chuyển đổi row từ Supabase (snake_case) sang User (camelCase)
function mapRow(row: any): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    provider: row.provider,
    isVip: row.is_vip,
    favorites: row.favorites ?? [],
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function createUser(
  email: string,
  password: string
): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) return null;

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: randomUUID(),
      email: normalizedEmail,
      password_hash: passwordHash,
      provider: 'email',
      is_vip: false,
      favorites: [],
    })
    .select()
    .single();

  if (error || !data) return null;

  return mapRow(data);
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (!data || !data.password_hash) return null;

  const isMatch = await bcrypt.compare(password, data.password_hash);
  return isMatch ? mapRow(data) : null;
}

export async function findOrCreateOAuthUser(
  email: string,
  avatarUrl: string | undefined,
  provider: 'google' | 'facebook'
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) return mapRow(existing);

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: randomUUID(),
      email: normalizedEmail,
      avatar_url: avatarUrl,
      provider,
      is_vip: false,
      favorites: [],
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create OAuth user: ${error?.message}`);
  }

  return mapRow(data);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return data ? mapRow(data) : undefined;
}

export async function setUserVip(id: string): Promise<void> {
  await supabase.from('users').update({ is_vip: true }).eq('id', id);
}

export async function toggleFavorite(
  userId: string,
  slug: string
): Promise<string[] | null> {
  const { data: user } = await supabase
    .from('users')
    .select('favorites')
    .eq('id', userId)
    .maybeSingle();

  if (!user) return null;

  const favorites: string[] = user.favorites ?? [];
  const newFavorites = favorites.includes(slug)
    ? favorites.filter((s) => s !== slug)
    : [...favorites, slug];

  await supabase
    .from('users')
    .update({ favorites: newFavorites })
    .eq('id', userId);

  return newFavorites;
}

export async function getStats(): Promise<{
  totalUsers: number;
  totalVip: number;
}> {
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: totalVip } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_vip', true);

  return {
    totalUsers: totalUsers ?? 0,
    totalVip: totalVip ?? 0,
  };
}