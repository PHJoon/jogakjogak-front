import type { Metadata } from 'next';

import { GoogleAnalytics } from '@next/third-parties/google';
import localFont from 'next/font/local';
import Script from 'next/script';

import './globals.css';

import GlobalErrorRedirector from '@/components/GlobalErrorRedirector';
import ScrollToTop from '@/components/ScrollToTop';
import SnackbarStack from '@/components/SnackbarStack';
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
  applicationName: '조각조각',
  keywords: ['조각조각', '취업 성공 투두리스트', '취업', '투두리스트', 'AI'],
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
    locale: 'ko_KR',
    type: 'website',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '조각조각',
    alternateName: ['조각 조각', 'JOGAK JOGAK', 'jogakjogak'],
    url: 'https://jogakjogak.com/',
    inLanguage: 'ko',
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '조각조각',
    url: 'https://jogakjogak.com/',
    logo: 'https://jogakjogak.com/logo.png',
  };

  const gaId =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_GA_ID_DEV
      : process.env.NEXT_PUBLIC_GA_ID_PROD;

  return (
    <html lang="ko">
      <head>
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={pretendard.variable}>
        <ReactQueryProvider>
          {children}
          <ScrollToTop />
          <SnackbarStack />
          <GlobalErrorRedirector />
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId={gaId ?? ''} />
    </html>
  );
}
