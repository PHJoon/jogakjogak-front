'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { FeedbackSurveyModal } from '@/components/FeedbackSurveyModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { JobAdd } from '@/components/JobAdd';
import { JobList } from '@/components/JobList';
import NoResumeModal from '@/components/NoResumeModal';
import { ResumeRegistration } from '@/components/ResumeRegistration';
import Snackbar from '@/components/Snackbar';
import useClientMeta from '@/hooks/useClientMeta';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { tokenManager } from '@/lib/auth/tokenManager';
import { getJdsData } from '@/lib/jds/jdsApi';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription, Resume } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';

import styles from './page.module.css';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);
  const [showNoResumeSnackbar, setShowNoResumeSnackbar] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const [sortOrder, setSortOrder] = useState<
    'createdAt,desc' | 'createdAt,asc'
  >('createdAt,desc');

  const initialPage = Number(searchParams.get('page')) || 0;
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: initialPage,
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
  const setJdCount = useBoundStore((state) => state.setJdCount);

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

  // 페이지 파라미터가 변경될 때마다 현재 페이지 정보 업데이트
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 0;
    setPageInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, [searchParams]);

  useEffect(() => {
    setJdCount(jds.length);
  }, [jds, setJdCount]);

  // 로그인 상태일 때 데이터 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      fetchJdsData(pageInfo.currentPage, sortOrder);
    }
  }, [isAuthenticated, sortOrder, pageInfo.currentPage]);

  const fetchJdsData = async (page: number, sort?: string) => {
    try {
      const res = await getJdsData(page, sort);

      if (res) {
        if (!res.resume) {
          setShowNoResumeModal(true);
          return;
        }
        setResume(res.resume);
        setJds(res.jds);
        setPageInfo(res.pageInfo);
      }
    } catch (error) {
      console.error('Failed to fetch jds data:', error);
    } finally {
      setIsDataLoaded(true);
    }
  };

  const handleJobClick = (jdId: number) => {
    router.push(`/job/${jdId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  const handleResumeRegisterClick = () => {
    setShowNoResumeModal(false);
    // 이력서 등록 페이지로 이동
    router.push('/resume/create');
  };

  const handleNoResumeClick = () => {
    setShowNoResumeSnackbar(true);
  };

  // 채용공고 삭제 핸들러
  const handleJobDelete = async (jobId: number | null) => {
    if (!jobId) return;

    try {
      const response = await fetchWithAuth(`/api/jds/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({
          isOpen: true,
          message: '채용공고가 삭제되었습니다.',
          type: 'success',
        });
        // 목록 새로고침
        await fetchJdsData(pageInfo.currentPage, sortOrder);
        setDeletingJobId(null);
      } else {
        setSnackbar({
          isOpen: true,
          message: '채용공고 삭제에 실패했습니다.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setSnackbar({
        isOpen: true,
        message: '채용공고 삭제 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
  };

  // 지원 완료 핸들러
  const handleApplyComplete = async (jobId: number) => {
    try {
      const response = await fetchWithAuth(`/api/jds/${jobId}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setSnackbar({
          isOpen: true,
          message: '지원 상태가 변경되었습니다.',
          type: 'success',
        });
        // 목록 새로고침
        await fetchJdsData(pageInfo.currentPage, sortOrder);
      } else {
        setSnackbar({
          isOpen: true,
          message: '지원 완료 처리에 실패했습니다.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error marking as applied:', error);
      setSnackbar({
        isOpen: true,
        message: '지원 완료 처리 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
  };

  if (isAuthenticated === null || !isDataLoaded) {
    return (
      <>
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
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
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
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value as 'createdAt,desc' | 'createdAt,asc'
                  )
                }
                className={styles.sortSelect}
              >
                <option value="createdAt,desc">최신순</option>
                <option value="createdAt,asc">오래된 순</option>
              </select>
            </div>
          </div>

          <div className={styles.jobSection}>
            {pageInfo.currentPage === 0 && (
              <JobAdd
                hasResume={!!resume}
                onNoResumeClick={handleNoResumeClick}
              />
            )}
            {jds.length > 0 &&
              jds.map((jd) => (
                <JobList
                  key={jd.jd_id}
                  title={jd.title}
                  company={jd.companyName}
                  registerDate={formatDate(jd.createdAt)}
                  state="default"
                  completedCount={String(jd.completed_pieces)}
                  totalCount={String(jd.total_pieces)}
                  dDay={calculateDDay(jd.endedAt)}
                  isApply={!!jd.applyAt}
                  isAlarmOn={jd.alarmOn}
                  onClick={() => handleJobClick(jd.jd_id)}
                  onApplyComplete={() => handleApplyComplete(jd.jd_id)}
                  onDelete={() => setDeletingJobId(jd.jd_id)}
                />
              ))}
          </div>

          <div className={styles.pagination}>
            {pageInfo.hasPrevious && (
              <button
                className={styles.paginationButton}
                onClick={() =>
                  router.replace(`?page=${pageInfo.currentPage - 1}`)
                }
              >
                이전
              </button>
            )}
            {pageInfo.hasNext && (
              <button
                className={`${styles.paginationButton} ${styles.nextButton}`}
                onClick={() =>
                  router.replace(`?page=${pageInfo.currentPage + 1}`)
                }
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
      <button onClick={() => setShowFeedbackSurveyModal(true)}>
        피드백 남기기
      </button>

      <Snackbar
        message="채용공고를 추가하기 전에 먼저 이력서를 등록해주세요."
        isOpen={showNoResumeSnackbar}
        onClose={() => setShowNoResumeSnackbar(false)}
        type="info"
        duration={3000}
      />

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        type={snackbar.type}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deletingJobId}
        onClose={() => setDeletingJobId(null)}
        onConfirm={() => handleJobDelete(deletingJobId)}
        title="정말 삭제하시겠습니까?"
        message="저장한 내용이 모두 없어져요."
        cancelText="취소"
        confirmText="삭제"
        highlightedText="삭제"
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
