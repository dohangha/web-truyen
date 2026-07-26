import Image from 'next/image';

export default function SupportSection() {
  return (
    <section className="mx-auto mt-10 max-w-2xl space-y-6 rounded-2xl border border-black/10 p-6 dark:border-white/10 sm:p-8">
      <div className="space-y-2 text-center">
        <span className="text-3xl">☕</span>
        <h2 className="text-2xl font-bold">Ủng Hộ Web Truyện</h2>
        <p className="text-secondary">
          Nếu bạn thấy trang web hữu ích, một ly cà phê nhỏ sẽ giúp mình có
          thêm động lực cập nhật truyện mới mỗi ngày 💛
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-56 w-56 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
          <Image
            src="/qr-code.png"
            alt="Mã QR ủng hộ"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="text-center text-sm">
          <p className="text-secondary">
            Ngân hàng:{' '}
            <span className="font-semibold text-black dark:text-white">
              BIDV - PGD Khương Thượng
            </span>
          </p>
          <p className="text-secondary">
            Số tài khoản:{' '}
            <span className="font-semibold text-black dark:text-white">
              1510732455
            </span>
          </p>
          <p className="text-secondary">
            Chủ tài khoản:{' '}
            <span className="font-semibold text-black dark:text-white">
              DO THI HANG HA
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
