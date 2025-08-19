'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { FeedbackSurveyModal } from '@/components/FeedbackSurveyModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { JobAdd } from '@/components/JobAdd';
import JobItem from '@/components/JobItem/JobItem';
import NoResumeModal from '@/components/NoResumeModal';
import { ResumeRegistration } from '@/components/ResumeRegistration';
import Snackbar from '@/components/Snackbar';
import useJdsQuery from '@/hooks/queries/useJdsQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { useQueryParams } from '@/hooks/useQueryParams';
import { tokenManager } from '@/lib/auth/tokenManager';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription, Resume, Sort } from '@/types/jds';

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
            <JobAdd />
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
  const [resume, setResume] = useState<Resume | null>(null);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);
  const [showNoResumeSnackbar, setShowNoResumeSnackbar] = useState(false);

  const {
    page,
    sort,
    setSort,
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
  }, [isAuthenticated, page, sort, data]);

  const handleResumeRegisterClick = () => {
    setShowNoResumeModal(false);
    // 이력서 등록 페이지로 이동
    router.push('/resume/create');
  };

  const handleNoResumeClick = () => {
    setShowNoResumeSnackbar(true);
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
          <ResumeRegistration
            hasResume={!!resume}
            resumeId={resume?.resumeId}
            resumeTitle={resume?.title}
            resumeUpdatedAt={resume?.updatedAt}
          />

          {/* 정렬 드롭다운 */}
          <div className={styles.sortContainer}>
            <div className={styles.sortDropdown}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className={styles.sortSelect}
              >
                <option value="createdAt,desc">최신순</option>
                <option value="createdAt,asc">오래된 순</option>
              </select>
            </div>
          </div>

          {/* job list */}
          <div className={styles.jobSection}>
            {pageInfo.currentPage === 0 && (
              <JobAdd
                hasResume={!!resume}
                onNoResumeClick={handleNoResumeClick}
              />
            )}
            {jds.length > 0 &&
              jds.map((jd) => (
                <JobItem key={jd.jd_id} jd={jd} state="default" />
              ))}
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

      <Snackbar
        message="채용공고를 추가하기 전에 먼저 이력서를 등록해주세요."
        isOpen={showNoResumeSnackbar}
        onClose={() => setShowNoResumeSnackbar(false)}
        type="info"
        duration={3000}
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
