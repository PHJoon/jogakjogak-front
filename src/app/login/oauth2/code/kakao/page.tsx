'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';

import styles from './page.module.css';

function KakaoCallbackContent() {
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    // Strict mode에서 두 번 실행 방지
    if (ranRef.current) return;
    ranRef.current = true;
    router.replace('/api/auth/bootstrap?redirect=/dashboard');
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
