'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingModal from '@/components/LoadingModal';
import useJdQuery from '@/hooks/queries/useJdQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { useBoundStore } from '@/stores/useBoundStore';

import FormContentLoading from './components/FormContentLoading';
import styles from './page.module.css';

function JobEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawJobId = searchParams.get('id');
  const jobId =
    rawJobId !== null && rawJobId.trim() !== '' && !isNaN(Number(rawJobId))
      ? Number(rawJobId)
      : null;

  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [deadline, setDeadline] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [nextJdId, setNextJdId] = useState<number | null>(null);
  const openFeedbackSurveyModal = useBoundStore(
    (state) => state.openFeedbackSurveyModal
  );

  const { data, isLoading, isError, error } = useJdQuery(jobId);

  useEffect(() => {
    if (data) {
      setJobTitle(data.title);
      setCompanyName(data.companyName);
      setJobPosition(data.job);
      const formattedDate = data.endedAt ? data.endedAt.split('T')[0] : '';
      setDeadline(formattedDate);
      setJobDescription(data.content);
      setJobUrl(data.jdUrl);
    }
  }, [data]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (
      jobTitle === data?.title &&
      companyName === data?.companyName &&
      jobPosition === data?.job &&
      (data.endedAt ? data.endedAt.split('T')[0] : '') === deadline &&
      jobDescription === data?.content &&
      jobUrl === data?.jdUrl
    ) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    // 필수 필드 검증
    if (!jobTitle.trim()) {
      alert('채용공고 제목을 입력해주세요.');
      return;
    }
    if (!companyName.trim()) {
      alert('회사 이름을 입력해주세요.');
      return;
    }
    if (!jobDescription.trim()) {
      alert('채용공고 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetchWithAuth(`/api/jds/update/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobTitle,
          companyName: companyName,
          job: jobPosition || '채용', // 직무명 필수 - 기본값 제공
          content: jobDescription,
          link: jobUrl, // jdUrl로 변환은 API route에서 처리
          endDate: deadline,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNextJdId(data.data.jd_id);
        setIsComplete(true);
        // LoadingModal의 onCompleteAnimationEnd에서 페이지 이동 처리
        openFeedbackSurveyModal();
      } else {
        alert(data.message || '채용공고 등록에 실패했습니다.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('JD submission error:', error);
      alert('채용공고 등록 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleCompleteAnimationEnd = () => {
    if (nextJdId) {
      router.replace(`/job/${nextJdId}`);
    }
  };

  // 클라이언트 메타 설정
  useClientMeta(
    `채용공고 등록 | 조각조각`,
    'AI가 분석할 채용공고를 등록합니다.'
  );

  // jobId가 숫자가 아니거나 비어있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (!jobId) {
      router.replace('/dashboard');
    }
  }, [jobId, router]);

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <Image
                src={arrowBackIcon}
                alt="뒤로가기"
                width={15.57}
                height={15.16}
              />
            </button>
            <h1 className={styles.title}>채용공고 수정하기</h1>
          </div>

          {isLoading && <FormContentLoading />}

          {!isLoading && !isError && (
            <div className={styles.content}>
              {/* 채용공고 제목 */}

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <input
                    type="text"
                    className={styles.titleInput}
                    placeholder="채용공고 제목을 입력해주세요."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    maxLength={30}
                  />
                  <span className={styles.counter}>{jobTitle.length}/30</span>
                </div>
              </div>

              {/* 회사 이름 */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="지원하는 회사 이름"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* 직무 이름 */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="지원하는 직무 이름"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              {/* 마감일 */}
              <div
                className={`${styles.inputWrapper} ${styles.dateWrapper} ${deadline ? styles.hasValue : ''}`}
              >
                <input
                  type="date"
                  className={styles.input}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <span className={styles.placeholderText}>
                  마감일 설정 (상시채용 시 건너뛰기)
                </span>
              </div>

              {/* 채용공고 내용 */}
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textarea}
                  placeholder="채용공고의 내용을 복사/붙여넣기 해주세요."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* URL */}
              <div className={styles.inputWrapper}>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="채용공고 URL 주소"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>

              {/* 완료하기 버튼 */}
              <button
                className={styles.completeButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className={styles.completeButtonText}>
                  {isSubmitting ? 'AI가 분석 중...' : '조각 생성하기'}
                </span>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <LoadingModal
        isOpen={isSubmitting}
        isComplete={isComplete}
        onCompleteAnimationEnd={handleCompleteAnimationEnd}
      />
    </>
  );
}

export default function JobEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobEditPageContent />
    </Suspense>
  );
}
