import type { Metadata } from 'next';

import { QueryClientProvider } from '@tanstack/react-query';
import localFont from 'next/font/local';

import './globals.css';

import ScrollToTop from '@/components/ScrollToTop';
import { queryClient, ReactQueryProvider } from '@/lib/queryClient';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
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
    canonical: 'https://www.jogakjogak.com/',
  },
  openGraph: {
    title: '조각조각',
    description: 'AI와 함께하는 나의 취업 성공 투두리스트',
    url: 'https://www.jogakjogak.com',
    siteName: '조각조각',
    images: [
      {
        url: 'https://www.jogakjogak.com/og_image_v1.png',
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
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <ReactQueryProvider>
          {children}
          <ScrollToTop />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
