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

const DEFAULT_STYLE = 'bg-secondary text-secondary-foreground';

export default function CategoryList({
  categories,
  max,
}: {
  categories: string[];
  max?: number;
}) {
  const visibleCategories = max ? categories.slice(0, max) : categories;
  const remaining = max ? categories.length - max : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleCategories.map((category) => (
        <span
          key={category}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            CATEGORY_STYLES[category] ?? DEFAULT_STYLE
          }`}
        >
          {category}
        </span>
      ))}
      {remaining > 0 && (
        <span className="bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm font-medium">
          +{remaining}
        </span>
      )}
    </div>
  );
}
