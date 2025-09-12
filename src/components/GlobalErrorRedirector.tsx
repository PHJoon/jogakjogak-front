'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { logout } from '@/lib/api/auth/authApi';
import { useBoundStore } from '@/stores/useBoundStore';

export default function GlobalErrorRedirector() {
  const router = useRouter();
  const globalError = useBoundStore((state) => state.error);
  const setGlobalError = useBoundStore((state) => state.setError);

  useEffect(() => {
    const errorHandler = async () => {
      if (!globalError) return;
      try {
        await logout();
      } catch (error) {
        console.warn('[logout failed]', (error as Error)?.message);
      } finally {
        router.push(`/?error=${globalError.errorCode}`);
      }
    };
    if (globalError) {
      errorHandler();
      setGlobalError(null);
    }
  }, [globalError, setGlobalError, router]);

  return null;
}
