'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

interface CurrentUser {
  email: string;
  avatarUrl?: string;
  isVip: boolean;
}

export default function AccountBadge() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  // Đang tải: giữ chỗ trống đúng kích thước để không bị "nhảy" layout
  if (loading) {
    return <div className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />;
  }

  if (!user) {
    return (
      <Link
        href="/dang-nhap"
        aria-label="Đăng nhập"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-white/10 sm:h-10 sm:w-10"
      >
        👤
      </Link>
    );
  }

  return (
    <Link
      href="/tai-khoan"
      aria-label="Tài khoản của tôi"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 dark:border-gray-600 sm:h-10 sm:w-10"
    >
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.email}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm">👤</span>
      )}

      {user.isVip && (
        <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">
          👑
        </span>
      )}
    </Link>
  );
}
