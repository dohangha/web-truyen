'use client';

import { useState } from 'react';

import Link from 'next/link';

import AccountBadge from '@/components/account-badge';
import NavLink from '@/components/header/nav-link';
import ThemeToggle from '@/components/theme-toggle';

const NAV_ITEMS = [
  { path: 'trangchu', name: 'Trang Chủ', icon: '🏠' },
  { path: 'trinhtham', name: 'Trinh Thám', icon: '🔍' },
  { path: 'codai', name: 'Cổ Đại', icon: '🏯' },
  { path: 'hiendai', name: 'Hiện Đại', icon: '🏙️' },
  { path: 'ngontinh', name: 'Ngôn Tình', icon: '💕' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-black/60 sm:px-8">
      <div className="relative flex flex-col py-4 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        {/* Hàng trên: logo + nút toggle theme + avatar + nút hamburger (mobile/tablet) */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-lg shadow-sm sm:h-10 sm:w-10 sm:text-xl">
              📖
            </span>
            <h1 className="whitespace-nowrap text-lg font-bold leading-none sm:text-xl lg:text-2xl">
              WEB{' '}
              <span className="text-amber-600 dark:text-amber-400">
                TRUYỆN
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <AccountBadge />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Menu: dropdown trên mobile/tablet, inline trên desktop rộng */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:overflow-visible ${
            isMenuOpen ? 'max-h-96' : 'max-h-0 lg:max-h-none'
          } lg:flex lg:items-center lg:gap-6`}
        >
          <ul className="flex flex-col gap-1 pt-4 lg:flex-row lg:items-center lg:gap-1 lg:pt-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} onClick={() => setIsMenuOpen(false)}>
                <NavLink path={item.path}>
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <AccountBadge />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
