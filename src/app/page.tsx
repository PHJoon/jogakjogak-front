'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { tokenManager } from '@/utils/auth';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import LoginModal from '@/components/LoginModal';
import section1 from '@/assets/images/section1.png';
import section2 from '@/assets/images/section2.png';
import section3 from '@/assets/images/section3.png';
import Background from '@/components/Background';

function HomeContent() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      const token = tokenManager.getAccessToken();

      // 기존 토큰이 있지만 쿠키에 없는 경우 마이그레이션
      if (token && !document.cookie.includes('accessToken=')) {
        tokenManager.setAccessToken(token); // 쿠키에도 저장
      }

      setIsAuthenticated(!!token);
    };

    checkAuth();

    // 토큰 변경 시 리스너 등록 (로그아웃 시 대응)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let message = '';
      switch (error) {
        case 'no_code':
          message = '인증 코드를 받지 못했습니다.';
          break;
        case 'login_failed':
          message = '로그인에 실패했습니다. 다시 시도해 주세요.';
          break;
        default:
          message = '오류가 발생했습니다.';
      }

      // 에러 메시지를 사용자에게 표시 (추후 토스트나 모달로 개선 가능)
      console.error('Login error:', message);

      // URL에서 에러 파라미터 제거
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  // 로딩 중인 경우만 처리 (리다이렉트는 middleware에서 처리)
  if (isAuthenticated === null) {
    return null; // 로딩 중
  }

  return (
    <div className={styles.container}>
      <Background />
      <Header
        showLogout={!!isAuthenticated}
        landingPage={true}
      />

      <HeroSection onLoginClick={() => setIsLoginModalOpen(true)} />

      <FeatureSection
        image={section1}
        imageAlt='조각조각 서비스 화면'
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
        imageAlt='진척도 확인 화면'
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
        imageAlt='알림 기능 화면'
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

      <Footer backgroundColor='transparent' />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
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
