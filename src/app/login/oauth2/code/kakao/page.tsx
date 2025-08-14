'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

import { tokenManager } from '@/lib/auth/tokenManager';

import styles from './page.module.css';

function KakaoCallbackContent() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // API를 통해 쿠키에서 refresh token 확인
        const getRefreshTokenResponse = await fetch(
          '/api/auth/get-refresh-token',
          {
            credentials: 'include',
          }
        );

        const refreshTokenData = await getRefreshTokenResponse.json();

        if (!refreshTokenData.refresh_token) {
          router.push('/?error=login_failed');
          return;
        }

        const refreshToken = refreshTokenData.refresh_token;

        // refresh_token으로 access_token 받기
        const response = await fetch('/api/member/reissue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });

        const data = await response.json();

        if (data.code === 200 && data.data?.access_token) {
          // access_token을 localStorage에 저장
          tokenManager.setAccessToken(data.data.access_token);
          router.push('/dashboard');
        } else {
          throw new Error(data.message || 'Failed to get tokens');
        }
      } catch (error) {
        console.error('Kakao callback error:', error);
        router.push('/?error=login_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
        height: '100vh',
        fontFamily: 'Pretendard',
      }}
    >
      <div className={styles.dots}>
        <div className={`${styles.dot} ${styles.dot1}`}></div>
        <div className={`${styles.dot} ${styles.dot2}`}></div>
        <div className={`${styles.dot} ${styles.dot3}`}></div>
      </div>
      <p className={styles.loadingText}>로그인 처리 중</p>
    </div>
  );
}

export default function KakaoCallback() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px',
            height: '100vh',
            fontFamily: 'Pretendard',
          }}
        >
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dot1}`}></div>
            <div className={`${styles.dot} ${styles.dot2}`}></div>
            <div className={`${styles.dot} ${styles.dot3}`}></div>
          </div>
          <p className={styles.loadingText}>로딩 중</p>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
