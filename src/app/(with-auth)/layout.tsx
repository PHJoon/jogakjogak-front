'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ERROR_CODES } from '@/constants/errorCode';
import { logout } from '@/lib/api/auth/authApi';

export default function WithAuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (!data?.isLoggedIn) {
        await logout()
          .catch((error) => {
            console.warn('[logout failed]', (error as Error)?.message);
          })
          .finally(() => {
            router.replace(`/?error=${ERROR_CODES.NOT_FOUND_TOKEN}`);
          });
      }
    };
    checkAuth();
  }, [router]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
