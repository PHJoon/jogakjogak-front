'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { FeedbackSurveyModal } from '@/components/FeedbackSurveyModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NoResumeModal from '@/components/NoResumeModal';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJdsQuery from '@/hooks/queries/useJdsQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { useQueryParams } from '@/hooks/useQueryParams';
import { tokenManager } from '@/lib/auth/tokenManager';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription, Sort } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import JobItem from './components/JobItem';
import JobItemAdd from './components/JobItemAdd';
import ResumeRegistration from './components/ResumeRegistration';
import SortDropdown from './components/SortDropdown';
import styles from './page.module.css';

function LoadingSkeleton() {
  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
      <main className={styles.main}>
        <div className={styles.containerLoading}>
          <div className={`${styles.skeleton} ${styles.resumeLoading}`} />
          <div
            className={`${styles.skeleton} ${styles.sortContainerLoading}`}
          />
          <div className={styles.jobSectionLoading}>
            <JobItemAdd />
            <div className={`${styles.skeleton} ${styles.jobLoading}`} />
            <div className={`${styles.skeleton} ${styles.jobLoading}`} />
            <div className={`${styles.skeleton} ${styles.jobLoading}`} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);

  const {
    page,
    sort,
    showOnly,
    setSort,
    setShowOnly,
    nextPage,
    prevPage,
    isPending: paginationPending,
  } = useQueryParams();

  const { data, isLoading } = useJdsQuery();

  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 0,
    hasNext: false,
    hasPrevious: false,
    isFirst: false,
    isLast: false,
  });

  const resume = useBoundStore((state) => state.resume);
  const setResume = useBoundStore((state) => state.setResume);

  const showFeedbackSurveyModal = useBoundStore(
    (state) => state.showFeedbackSurveyModal
  );
  const setShowFeedbackSurveyModal = useBoundStore(
    (state) => state.setShowFeedbackSurveyModal
  );

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 대시보드 | 조각조각',
    'AI가 분석할 채용공고를 추가하고 관리합니다.'
  );

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      const token = tokenManager.getAccessToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // 토큰 변경 시 리스너 등록 (로그아웃 시 대응)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      tokenManager.removeAccessToken();
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 로그인 상태일 때 데이터 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      if (data) {
        if (!data.resume) {
          setShowNoResumeModal(true);
          return;
        }
        setResume(data.resume);
        setJds(data.jds);
        setPageInfo(data.pageInfo);
      }
    }
  }, [isAuthenticated, data, setResume]);

  const handleResumeRegisterClick = () => {
    trackEvent({
      event: GAEvent.Resume.CREATE_PAGE_VIEW_ON_MODAL,
      event_category: GACategory.RESUME,
    });
    setShowNoResumeModal(false);
    // 이력서 등록 페이지로 이동
    router.push('/resume/create');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated === null || isLoading || paginationPending) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <ResumeRegistration />

          {/* 정렬 드롭다운 */}
          <div className={styles.sortContainer}>
            <SortDropdown setSort={setSort} setShowOnly={setShowOnly} />
          </div>

          {/* job list */}
          <div className={styles.jobSection}>
            {pageInfo.currentPage === 0 && <JobItemAdd />}
            {jds.length > 0 &&
              jds.map((jd) => <JobItem key={jd.jd_id} jd={jd} />)}
          </div>

          {/* pagination */}
          <div className={styles.pagination}>
            {pageInfo.hasPrevious && (
              <button className={styles.paginationButton} onClick={prevPage}>
                이전
              </button>
            )}
            {pageInfo.hasNext && (
              <button
                className={`${styles.paginationButton} ${styles.nextButton}`}
                onClick={nextPage}
              >
                다음
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <NoResumeModal
        isOpen={showNoResumeModal}
        onClose={() => setShowNoResumeModal(false)}
        onRegisterClick={handleResumeRegisterClick}
      />

      <FeedbackSurveyModal
        isOpen={showFeedbackSurveyModal}
        onClose={() => setShowFeedbackSurveyModal(false)}
      />
    </>
  );
}

export default function DashBoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
