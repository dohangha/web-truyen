export const metadata = {
  title: 'Chính Sách Bảo Mật',
  description: 'Chính sách bảo mật và quyền riêng tư của Web Truyện.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto mt-10 max-w-2xl space-y-6 md:mt-20">
      <h1 className="text-3xl font-bold">Chính Sách Bảo Mật</h1>
      <p className="text-secondary text-sm">Cập nhật lần cuối: 26/07/2026</p>

      <div className="text-secondary space-y-5 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            1. Thông tin chúng tôi thu thập
          </h2>
          <p>
            Khi bạn đăng ký tài khoản, chúng tôi thu thập địa chỉ email và
            mật khẩu (được mã hoá, không lưu dạng văn bản gốc). Nếu bạn đăng
            nhập qua Google hoặc Facebook, chúng tôi chỉ nhận địa chỉ email và
            ảnh đại diện công khai từ tài khoản đó, không truy cập bất kỳ
            thông tin nào khác.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <p>
            Thông tin được dùng để: xác thực đăng nhập, lưu danh sách truyện
            yêu thích của bạn, hiển thị bình luận, và xử lý nâng cấp thành
            viên VIP. Chúng tôi không bán, cho thuê, hay chia sẻ thông tin cá
            nhân của bạn cho bên thứ ba vì mục đích quảng cáo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            3. Cookie
          </h2>
          <p>
            Website sử dụng cookie để duy trì phiên đăng nhập của bạn. Cookie
            này không được dùng để theo dõi hành vi ngoài phạm vi website.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            4. Bảo mật
          </h2>
          <p>
            Mật khẩu tài khoản được mã hoá trước khi lưu trữ. Chúng tôi áp
            dụng các biện pháp hợp lý để bảo vệ dữ liệu người dùng khỏi truy
            cập trái phép.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            5. Quyền của bạn
          </h2>
          <p>
            Bạn có thể yêu cầu xoá tài khoản và toàn bộ dữ liệu liên quan bất
            cứ lúc nào bằng cách liên hệ với chúng tôi qua trang{' '}
            <a
              href="/contact"
              className="font-semibold text-amber-600 underline dark:text-amber-400"
            >
              Liên Hệ
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
            6. Liên hệ
          </h2>
          <p>
            Nếu có câu hỏi về chính sách này, vui lòng liên hệ qua trang{' '}
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
