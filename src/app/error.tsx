'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import styles from './page.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      className={styles.container}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#333',
        }}
      >
        오류가 발생했습니다
      </h1>

      <p
        style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: '#666',
        }}
      >
        일시적인 오류가 발생했습니다. 다시 시도해 주세요.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#7C3AED',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Pretendard',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#6D28D9')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#7C3AED')
          }
        >
          다시 시도
        </button>

        <button
          onClick={() => router.push('/')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: '#7C3AED',
            border: '2px solid #7C3AED',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Pretendard',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#F3F4F6')
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
