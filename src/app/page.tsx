'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

import section1 from '@/assets/images/section1.png';
import section2 from '@/assets/images/section2.png';
import section3 from '@/assets/images/section3.png';
import Background from '@/components/Background';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { ERROR_MESSAGES } from '@/constants/errorCode';
import useSession from '@/hooks/useSession';
import { queryClient } from '@/lib/queryClient';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './page.module.css';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSnackbar = useBoundStore((state) => state.setSnackbar);
  const { isLoggedIn } = useSession();

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error) return;
    const message =
      ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] ||
      '알 수 없는 오류가 발생했습니다.';
    setSnackbar({ type: 'error', message });

    // URL에서 에러 파라미터 제거
    router.replace('/');
  }, [searchParams, setSnackbar, router]);

  // 로그아웃, 회원탈퇴 시 쿼리 캐시 제거
  useEffect(() => {
    const hasCleanupCookie = document.cookie
      .split(';')
      .map((c) => c.trim())
      .some((c) => c.startsWith('clear_cache='));

    if (hasCleanupCookie) {
      queryClient.clear();
      document.cookie = 'clear_cache=; Max-Age=0; path=/; SameSite=Lax; Secure';
    }
  }, []);

  return (
    <div className={styles.container}>
      <Background />
      <Header />
      <HeroSection
        onCtaButtonClick={() => {
          if (isLoggedIn) {
            return router.push('/dashboard');
          }
          return router.push('/login');
        }}
      />

      <FeatureSection
        image={section1}
        imageAlt="조각조각 서비스 화면"
        title={
          <>
            이력서와 채용 공고로
            <br />
            지금 할 일을 알 수 있어요.
          </>
        }
        description={
          <>
            등록한 이력서와 관심 채용 공고를 비교 분석해,
            <br />
            지금 보완해야 할 항목을 AI가 자동으로 정리해 드려요.
          </>
        }
      />

      <FeatureSection
        image={section2}
        imageAlt="진척도 확인 화면"
        title={
          <>
            조각을 채워가며
            <br />
            작은 성취를 만들어가세요.
          </>
        }
        description={
          <>
            할 일을 진행할 때마다 조각이 채워져요.
            <br />
            조각을 완성하면 어느새 최종 합격이 눈앞에!
          </>
        }
        reversed
      />

      <FeatureSection
        image={section3}
        imageAlt="알림 기능 화면"
        title={
          <>
            멈춘 날도 괜찮아요.
            <br />
            다시 시작할 수 있게 도울게요.
          </>
        }
        description={
          <>
            진척도가 3일 동안 멈춰 있으면,
            <br />
            이메일로 할 일을 이어갈 수 있게 도와드려요.
          </>
        }
      />

      <Footer backgroundColor="transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
