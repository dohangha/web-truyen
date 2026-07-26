'use client';

import { useRecoilState } from 'recoil';

import Category from '@/components/filter/category';
import { categoriesState } from '@/states/categories';

export default function CategoryFilter({
  allCategories,
}: {
  allCategories: string[];
}) {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const clearAllActive = categories.selected.length > 0;

  const handleClearAll = () => {
    setCategories({
      selected: [],
      active: [],
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold">Search by topics</h3>
        <button
          onClick={handleClearAll}
          className={`text-xs ${
            !clearAllActive &&
            'pointer-events-none text-gray-300 dark:text-gray-600'
          }`}
        >
          Clear All
        </button>
      </div>
      <div className="no-scrollbar flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1">
        {allCategories.map((category) => (
          <Category key={category} category={category} />
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
