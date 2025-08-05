"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeRegistration } from "@/components/ResumeRegistration";
import { JobAdd } from "@/components/JobAdd";
import { JobList } from "@/components/JobList";
import { tokenManager } from "@/utils/auth";
import NoResumeModal from "@/components/NoResumeModal";
import Snackbar from "@/components/Snackbar";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

interface Resume {
  resumeId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface JobDescription {
  jd_id: number;
  title: string;
  isBookmark: boolean;
  companyName: string;
  total_pieces: number;
  completed_pieces: number;
  applyAt: string | null;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);
  const [showNoResumeSnackbar, setShowNoResumeSnackbar] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

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
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // 로그인 상태일 때 데이터 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      const sort = sortOrder === 'latest' ? 'createdAt,desc' : 'createdAt,asc';
      fetchJdsData(sort);
    }
  }, [isAuthenticated, sortOrder]);

  const fetchJdsData = async (sort?: string) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const queryParams = new URLSearchParams();
      
      if (sort) {
        queryParams.append('sort', sort);
      }
      
      const url = `/api/jds${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
      if (data.data) {
        setResume(data.data.resume);
        setJds(data.data.jds || []);
        
        // 이력서가 없는 경우 모달 표시
        if (!data.data.resume) {
          setShowNoResumeModal(true);
        }
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

  const calculateDDay = (endedAt: string) => {
    if (!endedAt) {
      return undefined;
    }
    const endDate = new Date(endedAt);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
  const handleJobDelete = async (jobId: number) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        setSnackbar({ isOpen: true, message: '채용공고가 삭제되었습니다.', type: 'success' });
        // 목록 새로고침
        const sort = sortOrder === 'latest' ? 'createdAt,desc' : 'createdAt,asc';
        fetchJdsData(sort);
        setDeletingJobId(null);
      } else {
        setSnackbar({ isOpen: true, message: '채용공고 삭제에 실패했습니다.', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setSnackbar({ isOpen: true, message: '채용공고 삭제 중 오류가 발생했습니다.', type: 'error' });
    }
  };

  // 지원 완료 핸들러
  const handleApplyComplete = async (jobId: number) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applyAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSnackbar({ isOpen: true, message: '지원 완료로 표시되었습니다.', type: 'success' });
        // 목록 새로고침
        const sort = sortOrder === 'latest' ? 'createdAt,desc' : 'createdAt,asc';
        fetchJdsData(sort);
      } else {
        setSnackbar({ isOpen: true, message: '지원 완료 처리에 실패했습니다.', type: 'error' });
      }
    } catch (error) {
      console.error('Error marking as applied:', error);
      setSnackbar({ isOpen: true, message: '지원 완료 처리 중 오류가 발생했습니다.', type: 'error' });
    }
  };

  if (isAuthenticated === null || !isDataLoaded) {
    return (
      <>
        <Header backgroundColor="white" showLogout={true} />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.resumeLoading}>
              <div className={styles.skeleton} style={{ height: '93px', borderRadius: '12px' }} />
            </div>
            
            <div className={styles.jobSection}>
              <JobAdd hasResume={!!resume} onNoResumeClick={handleNoResumeClick} />
              <div className={styles.jobLoading}>
                <div className={styles.skeleton} style={{ height: '140px', borderRadius: '12px' }} />
                <div className={styles.skeleton} style={{ height: '140px', borderRadius: '12px' }} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
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
                onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                className={styles.sortSelect}
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된 순</option>
              </select>
            </div>
          </div>
          
          <div className={styles.jobSection}>
            {currentPage === 1 && (
              <JobAdd hasResume={!!resume} onNoResumeClick={handleNoResumeClick} />
            )}
            
            {jds.length > 0 && (
              <>
                {(() => {
                  const startIndex = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage - 1;
                  const endIndex = currentPage === 1 ? itemsPerPage - 1 : startIndex + itemsPerPage;
                  
                  return jds
                    .slice(startIndex, endIndex)
                    .map((jd) => (
                    <JobList
                      key={jd.jd_id}
                      title={jd.title}
                      company={jd.companyName}
                      registerDate={formatDate(jd.createdAt)}
                      state="default"
                      completedCount={String(jd.completed_pieces)}
                      totalCount={String(jd.total_pieces)}
                      dDay={calculateDDay(jd.endedAt)}
                      apply={!!jd.applyAt}
                      onClick={() => handleJobClick(jd.jd_id)}
                      onApplyComplete={() => handleApplyComplete(jd.jd_id)}
                      onDelete={() => setDeletingJobId(jd.jd_id)}
                    />
                  ));
                })()}
                
                {/* 페이지네이션 버튼 */}
                {(() => {
                  const totalItems = jds.length + 1; // +1 for JobAdd button on first page
                  const hasNextPage = currentPage === 1 
                    ? totalItems > itemsPerPage - 1
                    : jds.length > (currentPage - 1) * itemsPerPage - 1;
                    
                  return (totalItems > itemsPerPage || currentPage > 1) && (
                  <div className={styles.pagination}>
                    {currentPage > 1 && (
                      <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        이전
                      </button>
                    )}
                    {hasNextPage && (
                      <button
                        className={`${styles.paginationButton} ${styles.nextButton}`}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        다음
                      </button>
                    )}
                  </div>
                  );
                })()}
              </>
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
        onConfirm={() => deletingJobId && handleJobDelete(deletingJobId)}
      />
    </>
  );
}