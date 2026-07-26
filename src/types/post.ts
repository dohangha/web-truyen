export interface Post {
  id: string;
  title: string;
  slug: string;
  categories: string[];
  cover: string;
  date: string;
  published: boolean;
  lastEditedAt: number;
  blurUrl?: string;
  views: number;
  status?: string;
  access?: string; // 'Miễn Phí' | 'VIP' | undefined
}
