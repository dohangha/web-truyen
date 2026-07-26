'use client';

import { useFavorites } from '@/components/favorites-provider';

export default function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-label={favorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm transition-all duration-300 ${
        favorited
          ? 'bg-rose-500 text-white'
          : 'bg-white/90 text-gray-400 hover:text-rose-500 dark:bg-black/60'
      }`}
    >
      {favorited ? '❤️' : '🤍'}
    </button>
  );
}
