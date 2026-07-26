export async function sendOrderNotification(order: {
  code: string;
  amount: number;
  email?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Web Truyện <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🔔 Có khách đăng ký nâng cấp VIP: ${order.code}`,
        html: `
          <p>Có 1 đơn nâng cấp thành viên VIP mới đang chờ xác nhận:</p>
          <ul>
            <li><b>Mã đơn:</b> ${order.code}</li>
            <li><b>Email khách:</b> ${order.email || 'không rõ'}</li>
            <li><b>Số tiền:</b> ${order.amount.toLocaleString('vi-VN')}đ</li>
          </ul>
          <p>Kiểm tra app ngân hàng, nếu đã nhận đúng tiền, vào <a href="${process.env.SITE_URL}/admin/orders">trang Admin</a> để xác nhận.</p>
        `,
      }),
    });
  } catch (error) {
    console.error('Gửi email thông báo thất bại:', error);
  }
}
