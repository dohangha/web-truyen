'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

const BANK_BIN = '970418'; // BIDV
const ACCOUNT_NUMBER = '1510732455';
const ACCOUNT_NAME = 'DO THI HANG HA';

export default function VipLockScreen({
  initialOrder,
}: {
  initialOrder?: { code: string; amount: number };
}) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder || null);
  const [status, setStatus] = useState<
    'idle' | 'creating' | 'waiting' | 'paid' | 'error'
  >(initialOrder ? 'waiting' : 'idle');
  const pollingRef = useRef<ReturnType<typeof setInterval>>();

  const checkStatus = async (code: string) => {
    const res = await fetch(`/api/orders/${code}`);
    const data = await res.json();

    if (data.status === 'paid') {
      setStatus('paid');
      clearInterval(pollingRef.current);
      setTimeout(() => router.refresh(), 1500);
    }
  };

  useEffect(() => {
    if (status !== 'waiting' || !order) return;

    pollingRef.current = setInterval(() => checkStatus(order.code), 5000);
    return () => clearInterval(pollingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, order]);

  const handleCreateOrder = async () => {
    setStatus('creating');

    const res = await fetch('/api/orders', { method: 'POST' });
    const data = await res.json();

    if (!res.ok || typeof data.amount !== 'number') {
      setStatus('error');
      return;
    }

    setOrder(data);
    setStatus('waiting');
  };

  const qrUrl = order
    ? `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-compact2.png?amount=${order.amount}&addInfo=${order.code}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`
    : '';

  return (
    <div className="mx-auto mt-6 max-w-md space-y-6 rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
      <span className="text-4xl">👑</span>
      <h2 className="text-2xl font-bold">Nâng Cấp Thành Viên VIP</h2>

      {status === 'idle' && (
        <>
          <p className="text-secondary">
            Thanh toán <b>1 lần duy nhất</b>, đọc <b>toàn bộ truyện VIP</b>{' '}
            trên web, không giới hạn thời gian.
          </p>
          <button
            onClick={handleCreateOrder}
            className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-amber-600"
          >
            Nâng Cấp Ngay
          </button>
        </>
      )}

      {status === 'creating' && (
        <p className="text-secondary">Đang tạo đơn hàng...</p>
      )}

      {status === 'error' && (
        <>
          <p className="text-sm text-red-500">
            Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.
          </p>
          <button
            onClick={handleCreateOrder}
            className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-amber-600"
          >
            Thử Lại
          </button>
        </>
      )}

      {status === 'waiting' && order && (
        <div className="space-y-4">
          <img
            src={qrUrl}
            alt="QR thanh toán"
            className="mx-auto rounded-xl border border-black/10 dark:border-white/10"
          />
          <p className="text-lg font-bold">
            {order.amount.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-secondary text-sm">
            Quét mã QR bằng app ngân hàng — số tiền và nội dung đã được điền
            sẵn, chỉ cần xác nhận chuyển.
          </p>
          <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            💡 Bạn có thể đóng trang này và quay lại sau bất cứ lúc nào (chỉ
            cần đăng nhập lại) — hệ thống tự nhớ đơn hàng của bạn.
          </div>
          <p className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Đang chờ xác nhận...
          </p>
        </div>
      )}

      {status === 'paid' && (
        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          ✅ Thanh toán thành công! Chào mừng thành viên VIP 👑
        </p>
      )}
    </div>
  );
}
