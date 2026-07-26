'use client';

import { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';

import { categoriesState } from '@/states/categories';

export default function SetCategoryFilter({ category }: { category: string }) {
  const setCategories = useSetRecoilState(categoriesState);

  useEffect(() => {
    setCategories((prev) => ({
      ...prev,
      selected: [category],
    }));

    // Reset lại khi rời khỏi trang, để không bị "dính" filter khi qua trang khác
    return () => {
      setCategories((prev) => ({
        ...prev,
        selected: [],
      }));
    };
  }, [category, setCategories]);

  return null;
}
