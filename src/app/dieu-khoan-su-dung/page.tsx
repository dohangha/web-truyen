export const metadata = {
  title: 'Điều Khoản Sử Dụng',
  description: 'Điều khoản sử dụng dịch vụ Web Truyện.',
};

export default function TermsPage() {
  return (
    <article className="mx-auto mt-10 max-w-2xl space-y-6 md:mt-20">
      <h1 className="text-3xl font-bold">Điều Khoản Sử Dụng</h1>
      <p className="text-secondary text-sm">Cập nhật lần cuối: 26/07/2026</p>

      <div className="text-secondary space-y-5 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            1. Chấp nhận điều khoản
          </h2>
          <p>
            Khi truy cập và sử dụng Web Truyện, bạn đồng ý tuân thủ các điều
            khoản được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng
            dịch vụ.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            2. Tài khoản người dùng
          </h2>
          <p>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình. Chúng
            tôi không chịu trách nhiệm cho các thiệt hại phát sinh từ việc
            bạn để lộ thông tin tài khoản cho người khác.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            3. Nội dung và bình luận
          </h2>
          <p>
            Người dùng chịu trách nhiệm về nội dung bình luận mình đăng tải.
            Chúng tôi có quyền xoá bất kỳ bình luận nào vi phạm pháp luật,
            xúc phạm người khác, hoặc spam mà không cần báo trước.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            4. Thành viên VIP
          </h2>
          <p>
            Nâng cấp thành viên VIP là giao dịch một lần, không hoàn tiền sau
            khi đã xác nhận thành công, trừ trường hợp lỗi kỹ thuật từ phía
            chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            5. Thay đổi điều khoản
          </h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản này theo thời gian. Việc bạn
            tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc
            chấp nhận điều khoản mới.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            6. Liên hệ
          </h2>
          <p>
            Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua trang{' '}
            <a
              href="/contact"
              className="font-semibold text-amber-600 underline dark:text-amber-400"
            >
              Liên Hệ
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
