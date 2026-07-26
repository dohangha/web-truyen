'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold transition-colors duration-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-white/10"
    >
      Đăng Xuất
    </button>
  );
}
