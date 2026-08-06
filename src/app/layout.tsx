import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'react-notion-x/src/styles.css';

import { Metadata } from 'next';
import Script from 'next/script';

import Header from '@/components/header/header';
import Footer from '@/components/footer';
import FavoritesProvider from '@/components/favorites-provider';
import Provider from '@/components/provider';
import ScrollUpButton from '@/components/scroll-up-button';
import '@/styles/globals.css';
import '@/styles/paginate.css';

const SITE_URL = process.env.SITE_URL || 'https://dohangha.com';
const SITE_NAME = 'Web Truyện';
const SITE_DESCRIPTION =
  'Đọc truyện online miễn phí: Trinh Thám, Cổ Đại, Hiện Đại, Ngôn Tình. Cập nhật truyện mới mỗi ngày.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Đọc Truyện Online Miễn Phí`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'đọc truyện online',
    'truyện trinh thám',
    'truyện cổ đại',
    'truyện hiện đại',
    'truyện ngôn tình',
    'web truyện',
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Đọc Truyện Online Miễn Phí`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Đọc Truyện Online Miễn Phí`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="text-primary bg-primary relative mx-auto mb-20 flex w-full max-w-screen-xl flex-col px-[10vw] md:px-[5vw]">
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ESYV6KZFHW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ESYV6KZFHW');
          `}
        </Script>

        <Provider>
          <FavoritesProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <div className="fixed bottom-12 right-10">
              <ScrollUpButton />
            </div>
          </FavoritesProvider>
        </Provider>
      </body>
    </html>
  );
}