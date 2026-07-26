import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 pb-8 pt-10 dark:border-white/10">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 text-sm">
            📖
          </span>
          <span className="font-bold">
            WEB{' '}
            <span className="text-amber-600 dark:text-amber-400">
              TRUYỆN
            </span>
          </span>
        </div>

        <nav className="text-secondary flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/trangchu"
            className="hover:text-primary transition-colors duration-300"
          >
            Trang Chủ
          </Link>
          <Link
            href="/about"
            className="hover:text-primary transition-colors duration-300"
          >
            Giới Thiệu
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors duration-300"
          >
            Liên Hệ
          </Link>
          <Link
            href="/tai-khoan"
            className="hover:text-primary text-amber-600 transition-colors duration-300 dark:text-amber-400"
          >
            👑 Tài Khoản / VIP
          </Link>
        </nav>
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Web Truyện. Made with 💛 for readers.
      </p>
    </footer>
  );
}
