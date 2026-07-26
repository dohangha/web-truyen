'use client';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { categoriesState } from '@/states/categories';
import { pageState } from '@/states/page';
import { isTouchDevice } from '@/utils/is-touch-device';

const CATEGORY_STYLES: Record<string, string> = {
  'Trinh Thám':
    'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
  'Cổ Đại':
    'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
  'Hiện Đại': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  'Ngôn Tình': 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100',
  'Truyện Mới Nhất':
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
};

const DEFAULT_STYLE = 'bg-secondary';

export default function Category({ category }: { category: string }) {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const setPage = useSetRecoilState(pageState);
  const checked = categories.selected.includes(category);
  const active = categories.active.includes(category);

  const handleCategoryClick = (category: string) => () => {
    setCategories((prevCategories) => {
      if (prevCategories.selected.includes(category)) {
        return {
          ...prevCategories,
          selected: prevCategories.selected.filter(
            (value) => value !== category
          ),
        };
      } else {
        return {
          ...prevCategories,
          selected: [...prevCategories.selected, category],
        };
      }
    });

    setPage(1);
  };

  return (
    <button
      onClick={handleCategoryClick(category)}
      className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-6 py-2 font-medium ring-red-500 transition-all duration-300 hover:ring-offset-4 dark:ring-offset-customGray-dark ${
        checked
          ? 'bg-black text-white ring-[3px] ring-offset-4 dark:bg-white dark:text-black'
          : CATEGORY_STYLES[category] ?? DEFAULT_STYLE
      } ${!active && 'pointer-events-none opacity-25'} ${
        active && !isTouchDevice() && 'hover:ring-[3px]'
      }`}
    >
      {category}
    </button>
  );
}
