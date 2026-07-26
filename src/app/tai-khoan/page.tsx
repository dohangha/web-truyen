import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/libs/auth-helpers';
import { getPendingOrderForUser } from '@/libs/orders';
import { getRecommendedPosts } from '@/libs/recommendations';
import { getAllPostsFromNotion } from '@/services/posts';
import HomeSection from '@/components/home/home-section';
import LogoutButton from '@/components/logout-button';
import VipLockScreen from '@/components/vip-lock-screen';

export const metadata = {
  title: 'Tài Khoản Của Tôi',
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/dang-nhap');
  }

  const allPosts = await getAllPostsFromNotion();
  const favoritePosts = allPosts.filter((p) => user.favorites.includes(p.slug));
  const recommendedPosts = getRecommendedPosts(allPosts, user.favorites, 8);

  const pendingOrder = user.isVip
    ? undefined
    : await getPendingOrderForUser(user.id);

  const joinDate = new Date(user.createdAt).toLocaleDateString('vi-VN');

  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-12">
      {/* Cover + thông tin tài khoản */}
      <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
        <div
          className={`h-28 w-full ${
            user.isVip
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600'
          }`}
        />

        <div className="flex flex-col items-center px-8 pb-8">
          <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-customGray-dark dark:bg-customGray-dark">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.email}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl">{user.isVip ? '👑' : '👤'}</span>
            )}
          </div>

          <h1 className="mt-3 text-xl font-bold">{user.email}</h1>
          <p className="text-secondary text-sm">Thành viên từ {joinDate}</p>

          {user.isVip ? (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              👑 Thành viên VIP
            </span>
          ) : (
            <span className="text-secondary mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm dark:bg-white/5">
              Thành viên thường
            </span>
          )}

          <div className="mt-6 grid w-full grid-cols-2 gap-4 border-t border-black/5 pt-6 dark:border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold">{favoritePosts.length}</p>
              <p className="text-secondary text-xs">Truyện yêu thích</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {user.provider === 'email' ? '✉️' : user.provider === 'google' ? 'G' : 'f'}
              </p>
              <p className="text-secondary text-xs">Đăng nhập qua</p>
            </div>
          </div>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </div>

      {!user.isVip && <VipLockScreen initialOrder={pendingOrder} />}

      {favoritePosts.length > 0 && (
        <HomeSection title="❤️ Truyện Yêu Thích" posts={favoritePosts} />
      )}

      {recommendedPosts.length > 0 && (
        <HomeSection title="✨ Đề Cử Cho Bạn" posts={recommendedPosts} />
      )}

      {favoritePosts.length === 0 && (
        <p className="text-secondary text-center">
          Bạn chưa thích truyện nào. Bấm biểu tượng 🤍 trên bìa truyện để lưu
          vào đây, mình sẽ đề cử thêm truyện hợp gu cho bạn!
        </p>
      )}
    </div>
  );
}
