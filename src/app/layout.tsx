import type { Metadata } from 'next';

import { GoogleAnalytics } from '@next/third-parties/google';
import localFont from 'next/font/local';

import './globals.css';

import ScrollToTop from '@/components/ScrollToTop';
import { ReactQueryProvider } from '@/lib/queryClient';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '조각조각',
  description: 'AI와 함께하는 나의 취업 성공 투두리스트',
  creator: 'JogakJogak',
  authors: [
    { name: 'JogakJogak Team', url: 'mailto:jogakjogakhelp@gmail.com' },
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://jogakjogak.com/',
  },
  openGraph: {
    title: '조각조각',
    description: 'AI와 함께하는 나의 취업 성공 투두리스트',
    url: 'https://jogakjogak.com',
    siteName: '조각조각',
    images: [
      {
        url: 'https://jogakjogak.com/og_image_v1.png',
        width: 1200,
        height: 630,
        alt: '조각조각 OG 이미지',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_GA_ID_DEV
      : process.env.NEXT_PUBLIC_GA_ID_PROD;

  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <ReactQueryProvider>
          {children}
          <ScrollToTop />
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId={gaId ?? ''} />
    </html>
  );
}
