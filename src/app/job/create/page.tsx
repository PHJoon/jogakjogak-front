'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingModal from '@/components/LoadingModal';
import { tokenManager } from '@/utils/auth';

import styles from './page.module.css';

export default function CreateJobPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [deadline, setDeadline] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [nextJdId, setNextJdId] = useState<number | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
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
      const accessToken = tokenManager.getAccessToken();

      const response = await fetch('/api/jds/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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
            <h1 className={styles.title}>채용공고 등록하기</h1>
          </div>

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
