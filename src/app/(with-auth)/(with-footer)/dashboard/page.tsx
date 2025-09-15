'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import JobItem from '@/components/dashboard/JobItem';
import JobItemAdd from '@/components/dashboard/JobItemAdd';
import ResumeRegistration from '@/components/dashboard/ResumeRegistration';
import SortDropdown from '@/components/dashboard/SortDropdown';
import NoResumeModal from '@/components/NoResumeModal';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJdsQuery from '@/hooks/queries/useJdsQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription, Sort } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

function LoadingSkeleton() {
  return (
    <main className={styles.main}>
      <div className={styles.containerLoading}>
        <div className={`${styles.skeleton} ${styles.resumeLoading}`} />
        <div className={`${styles.skeleton} ${styles.sortContainerLoading}`} />
        <div className={styles.jobSectionLoading}>
          <JobItemAdd />
          <div className={`${styles.skeleton} ${styles.jobLoading}`} />
          <div className={`${styles.skeleton} ${styles.jobLoading}`} />
          <div className={`${styles.skeleton} ${styles.jobLoading}`} />
        </div>
      </div>
    </main>
  );
}

function DashboardContent() {
  const router = useRouter();
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

  const setResume = useBoundStore((state) => state.setResume);

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 대시보드 | 조각조각',
    'AI가 분석할 채용공고를 추가하고 관리합니다.'
  );

  useEffect(() => {
    if (data) {
      if (!data.resume) {
        setShowNoResumeModal(true);
        return;
      }
      setResume(data.resume);
      setJds(data.jds);
      setPageInfo(data.pageInfo);
    }
  }, [data, setResume]);

  const handleResumeRegisterClick = () => {
    trackEvent({
      event: GAEvent.Resume.CREATE_PAGE_VIEW_ON_MODAL,
      event_category: GACategory.RESUME,
    });
    setShowNoResumeModal(false);
    // 이력서 등록 페이지로 이동
    router.push('/resume/create');
  };

  if (isLoading || paginationPending) {
    return <LoadingSkeleton />;
  }

  return (
    <>
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

      <NoResumeModal
        isOpen={showNoResumeModal}
        onClose={() => setShowNoResumeModal(false)}
        onRegisterClick={handleResumeRegisterClick}
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
