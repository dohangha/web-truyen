export const metadata = {
  title: 'Hướng Dẫn Xoá Dữ Liệu',
  description: 'Hướng dẫn yêu cầu xoá tài khoản và dữ liệu cá nhân trên Web Truyện.',
};

export default function DataDeletionPage() {
  return (
    <article className="mx-auto mt-10 max-w-2xl space-y-6 md:mt-20">
      <h1 className="text-3xl font-bold">Hướng Dẫn Xoá Dữ Liệu</h1>

      <div className="text-secondary space-y-5 leading-relaxed">
        <p>
          Bạn có toàn quyền yêu cầu xoá tài khoản và toàn bộ dữ liệu cá nhân
          liên quan đã lưu trên Web Truyện (bao gồm email, danh sách truyện
          yêu thích, bình luận, và trạng thái thành viên).
        </p>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            Cách yêu cầu xoá dữ liệu
          </h2>
          <p>
            Gửi yêu cầu qua trang{' '}
            <a
              href="/contact"
              className="font-semibold text-amber-600 underline dark:text-amber-400"
            >
              Liên Hệ
            </a>{' '}
            , ghi rõ email tài khoản bạn muốn xoá. Chúng tôi sẽ xử lý yêu cầu
            và xoá toàn bộ dữ liệu liên quan trong vòng 7 ngày làm việc.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            Nếu bạn đăng nhập qua Google hoặc Facebook
          </h2>
          <p>
            Việc xoá tài khoản trên Web Truyện không tự động thu hồi quyền
            truy cập đã cấp cho ứng dụng từ phía Google/Facebook. Bạn có thể
            tự thu hồi quyền này trong phần cài đặt bảo mật của tài khoản
            Google/Facebook của mình.
          </p>
        </section>
      </div>
    </article>
  );
}
