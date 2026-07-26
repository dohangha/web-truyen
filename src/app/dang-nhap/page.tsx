'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import OAuthButtons from '@/components/oauth-buttons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Có lỗi xảy ra');
      setLoading(false);
      return;
    }

    router.push('/tai-khoan');
    router.refresh();
  };

  return (
    <div className="mx-auto mt-20 max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-center text-2xl font-bold">Đăng Nhập</h1>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-full border-2 border-gray-300 px-6 py-3 outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-customGray-dark"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full rounded-full border-2 border-gray-300 px-6 py-3 outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-customGray-dark"
        />

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>

        <p className="text-secondary text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link
            href="/dang-ky"
            className="font-semibold text-amber-600 underline dark:text-amber-400"
          >
            Đăng ký
          </Link>
        </p>

        <OAuthButtons />
      </form>
    </div>
  );
}
