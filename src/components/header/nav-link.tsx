'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function NavLink({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = path.split('?')[0] === segment;

  return (
    <Link
      href={`/${path}`}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 lg:text-base ${
        isActive
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'text-secondary hover:bg-black/5 hover:text-primary dark:hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}
