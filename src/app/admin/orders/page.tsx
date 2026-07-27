'use client';

import { useEffect, useState } from 'react';

interface Order {
  code: string;
  userId: string;
  email?: string;
  amount: number;
  status: string;
  createdAt: number;
}

interface Stats {
  totalUsers: number;
  totalVip: number;
}

export default function AdminOrdersPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  const fetchData = async (pw: string) => {
    const [ordersRes, statsRes] = await Promise.all([
      fetch('/api/admin/orders', { headers: { 'x-admin-password': pw } }),
      fetch('/api/admin/stats', { headers: { 'x-admin-password': pw } }),
    ]);

    if (!ordersRes.ok || !statsRes.ok) {
      setError('Sai mật khẩu');
      setAuthed(false);
      return;
    }

    const ordersData = await ordersRes.json();
    const statsData = await statsRes.json();

    setOrders(ordersData.orders);
    setStats(statsData);
    setAuthed(true);
    setError('');
  };

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchData(password), 5000);
    return () => clearInterval(interval);
  }, [authed, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const handleConfirm = async (code: string) => {
    await fetch(`/api/admin/orders/${code}`, {
      method: 'POST',
      headers: { 'x-admin-password': password },
    });
    fetchData(password);
  };

  if (!authed) {
    return (
      <div className="mx-auto mt-20 max-w-sm">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-center text-2xl font-bold">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu admin"
            className="w-full rounded-full border-2 border-gray-300 px-6 py-3 text-center outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-customGray-dark"
          />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white dark:bg-white dark:text-black"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8">
      {/* Thống kê thành viên */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/10 p-6 text-center dark:border-white/10">
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-secondary text-sm">Tổng thành viên</p>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-6 text-center dark:bg-amber-900/20">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              👑 {stats.totalVip}
            </p>
            <p className="text-secondary text-sm">Thành viên VIP</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Đơn Nâng Cấp VIP Đang Chờ</h1>
        <p className="text-secondary text-sm">
          Tự động làm mới mỗi 5 giây. Kiểm tra app ngân hàng, nếu thấy đúng
          mã đơn hàng trong nội dung chuyển khoản, bấm{" "}
          <strong>&quot;Xác nhận đã nhận tiền&quot;</strong>.
        </p>

        {orders.length === 0 && (
          <p className="text-secondary py-10 text-center">
            Không có đơn hàng nào đang chờ.
          </p>
        )}

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.code}
              className="flex items-center justify-between rounded-xl border border-black/10 p-4 dark:border-white/10"
            >
              <div>
                <p className="font-bold">{order.code}</p>
                <p className="text-secondary text-sm">
                  {order.email || 'Không rõ email'} ·{' '}
                  {order.amount.toLocaleString('vi-VN')}đ
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => handleConfirm(order.code)}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Xác nhận đã nhận tiền
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
