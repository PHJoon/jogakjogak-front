'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

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
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

function LoadingSkeleton() {
  return (
    <main className={styles.main}>
      <div className={styles.containerLoading}>
        <div className={`${styles.skeleton} ${styles.resumeLoading}`} />
        <div className={`${styles.skeleton} ${styles.sortContainerLoading}`} />
        <div className={styles.jobSectionLoading}>
          <JobItemAdd jdsCount={0} />
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
  const searchParams = useSearchParams();
  const onboarding = searchParams.get('onboarding');
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);
  const ranRef = useRef(false);

  const {
    setSort,
    setShowOnly,
    nextPage,
    prevPage,
    isPending: paginationPending,
  } = useQueryParams();

  const { data, isLoading, refetch } = useJdsQuery();

  const setResume = useBoundStore((state) => state.setResume);

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 대시보드 | 조각조각',
    'AI가 분석할 채용공고를 추가하고 관리합니다.'
  );

  useEffect(() => {
    if (!data) return;
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      if (onboarding === 'true') {
        await refetch(); // 캐시 갱신
        router.replace('/dashboard'); // 그 다음 이동
        return;
      }

      if (data.isOnboarded === false) {
        router.replace('/onboarding');
        return;
      }

      if (!data.resume) {
        setShowNoResumeModal(true);
        return;
      }

      setResume(data.resume);
    })();
  }, [data, setResume, router, onboarding, refetch, isLoading]);

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

  if (!data) {
    return null;
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
            {data.pageInfo.currentPage === 0 && (
              <JobItemAdd jdsCount={data.jds.length} />
            )}
            {data.jds.length > 0 &&
              data.jds.map((jd) => <JobItem key={jd.jd_id} jd={jd} />)}
          </div>

          {/* pagination */}
          <div className={styles.pagination}>
            {data.pageInfo.hasPrevious && (
              <button className={styles.paginationButton} onClick={prevPage}>
                이전
              </button>
            )}
            {data.pageInfo.hasNext && (
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
