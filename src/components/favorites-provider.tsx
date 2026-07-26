'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (slug: string) => Promise<void>;
  isFavorited: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorited: () => false,
});

export function useFavorites() {
  return useContext(FavoritesContext);
}

export default function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => {});
  }, []);

  const toggleFavorite = async (slug: string) => {
    // Cập nhật ngay trên giao diện trước (optimistic), rồi mới gọi API
    const wasFavorited = favorites.includes(slug);
    setFavorites((prev) =>
      wasFavorited ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

    const res = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    if (res.status === 401) {
      // Chưa đăng nhập -> hoàn tác lại thay đổi tạm thời, chuyển hướng đăng nhập
      setFavorites((prev) =>
        wasFavorited ? [...prev, slug] : prev.filter((s) => s !== slug)
      );
      window.location.href = '/dang-nhap';
      return;
    }

    const data = await res.json();
    if (data.favorites) setFavorites(data.favorites);
  };

  const isFavorited = (slug: string) => favorites.includes(slug);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorited }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
