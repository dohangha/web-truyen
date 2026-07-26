import SupportSection from '@/components/support-section';

export const metadata = {
  title: 'Liên Hệ',
  description: 'Liên hệ với Web Truyện để góp ý, báo lỗi hoặc gửi truyện.',
};

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'hadohang@gmail.com',
    href: 'mailto:hadohang@gmail.com',
    icon: '✉️',
  },
  {
    label: 'Facebook',
    value: 'facebook.com/tacgiavanhoc',
    href: 'https://www.facebook.com/tacgiavanhoc',
    icon: '📘',
  },
  {
    label: 'Zalo',
    value: 'Nhắn tin qua Zalo',
    href: 'https://zalo.me/',
    icon: '💬',
  },
];

export default function ContactPage() {
  return (
    <article className="mx-auto mt-10 max-w-2xl space-y-8 md:mt-20">
      <div className="space-y-3 text-center">
        <span className="text-4xl">💌</span>
        <h1 className="text-3xl font-bold">Liên Hệ</h1>
        <p className="text-secondary">
          Có góp ý, báo lỗi, hay muốn gửi truyện của bạn? Mình luôn sẵn sàng
          lắng nghe.
        </p>
      </div>

      <div className="space-y-3">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:border-amber-400/60 flex items-center gap-4 rounded-2xl border border-black/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10"
          >
            <span className="text-2xl">{link.icon}</span>
            <div>
              <p className="text-sm text-gray-400">{link.label}</p>
              <p className="font-semibold">{link.value}</p>
            </div>
          </a>
        ))}
      </div>

      <SupportSection />
    </article>
  );
}
