export const metadata = {
  title: 'Giới Thiệu',
  description: 'Giới thiệu về Web Truyện - nơi đọc truyện online miễn phí.',
};

export default function AboutPage() {
  return (
    <article className="mx-auto mt-10 max-w-2xl space-y-8 md:mt-20">
      <div className="space-y-3 text-center">
        <span className="text-4xl">📖</span>
        <h1 className="text-3xl font-bold">
          Về <span className="text-amber-600 dark:text-amber-400">Web Truyện</span>
        </h1>
      </div>

      <div className="text-secondary space-y-5 leading-relaxed">
        <p>
          Web Truyện là nơi mình chia sẻ những câu chuyện thuộc nhiều thể
          loại khác nhau — từ trinh thám kịch tính, cổ trang lãng mạn, hiện
          đại gần gũi cho đến ngôn tình ngọt ngào. Mỗi tuần đều có truyện
          mới được cập nhật.
        </p>
        <p>
          Trang web được xây dựng và vận hành bởi một cá nhân yêu thích đọc
          truyện, với mong muốn tạo ra một không gian đọc truyện đơn giản,
          nhanh, không quảng cáo gây phiền, hoàn toàn miễn phí.
        </p>
        <p>
          Một số nội dung trên trang có sự hỗ trợ từ công cụ AI trong quá
          trình biên soạn và chỉnh sửa. Mình luôn cố gắng đảm bảo chất lượng
          và trải nghiệm đọc tốt nhất có thể.
        </p>
        <p>
          Nếu bạn thấy thích trang web này, đừng ngại{' '}
          <a
            href="/contact"
            className="font-semibold text-amber-600 underline underline-offset-2 dark:text-amber-400"
          >
            liên hệ
          </a>{' '}
          để góp ý hoặc chia sẻ cảm nhận nhé!
        </p>
      </div>
    </article>
  );
}
