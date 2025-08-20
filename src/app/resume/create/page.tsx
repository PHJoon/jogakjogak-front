'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import { Button } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ResumeHelper from '@/components/ResumeHelper';
import useClientMeta from '@/hooks/useClientMeta';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

import styles from './page.module.css';

function ResumeCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');
  const [resumeTitle, setResumeTitle] = useState('나의 이력서');
  const [resumeText, setResumeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 이력서 내용 오류 모달 상태
  const [isResumeContentErrorModalOpen, setIsResumeContentErrorModalOpen] =
    useState(false);
  const [contentErrorMessage, setContentErrorMessage] = useState({
    modalTitle: '',
    modalContent: '',
  });

  // 뒤로가기 확인 모달 상태
  const [isBackConfirmModalOpen, setBackConfirmModalOpen] = useState(false);
  // 기존 이력서 내용 - 제출 전 변경 여부 확인용
  const [InitialResumeContents, setInitialResumeContents] = useState({
    title: '나의 이력서',
    content: '',
  });

  const fetchResume = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/api/resume/${resumeId}`);

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setResumeTitle(data.data.title || '나의 이력서');
          setResumeText(data.data.content || '');
          setInitialResumeContents({
            title: data.data.title || '나의 이력서',
            content: data.data.content || '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  // 이력서 내용 변경 여부 확인
  const hasUnsavedChanges = useMemo(() => {
    return (
      InitialResumeContents.title.trim() !== resumeTitle.trim() ||
      InitialResumeContents.content.trim() !== resumeText.trim()
    );
  }, [InitialResumeContents, resumeTitle, resumeText]);

  // 클라이언트 메타 설정
  useClientMeta(
    `이력서 ${resumeId ? '수정' : '등록'} | 조각조각`,
    `이력서를 ${resumeId ? '수정' : '등록'}합니다.`
  );

  // resumeId가 있으면 기존 이력서 불러오기
  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId, fetchResume]);

  // 브라우저 새로고침 시 확인창 띄우기
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setBackConfirmModalOpen(true);
      return;
    }
    router.back();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeTitle(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!hasUnsavedChanges) {
      setContentErrorMessage({
        modalTitle: '변경된 내용이 없어요.',
        modalContent: '이력서 내용을 수정한 후 제출해주세요.',
      });
      setIsResumeContentErrorModalOpen(true);
      return;
    }

    if (!resumeTitle.trim() || !resumeText.trim()) {
      setContentErrorMessage({
        modalTitle: '이력서 내용이 유효하지 않아요.',
        modalContent: '제목과 내용을 입력해주세요.',
      });
      setIsResumeContentErrorModalOpen(true);
      return;
    }

    if (resumeText.trim().length < 300 || resumeText.length > 5000) {
      setContentErrorMessage({
        modalTitle: '이력서 내용이 유효하지 않아요.',
        modalContent:
          '이력서 내용은 300자 이상,\n5000자 이하로 작성해주세요.\n(앞뒤 공백은 제외됩니다.)',
      });
      setIsResumeContentErrorModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const url = resumeId ? `/api/resume/${resumeId}` : '/api/resume';
      const method = resumeId ? 'PATCH' : 'POST';

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resumeTitle,
          content: resumeText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          resumeId
            ? '이력서가 성공적으로 수정되었습니다.'
            : '이력서가 성공적으로 등록되었습니다.'
        );
        router.replace(resumeId ? `/dashboard` : '/job/create');
      } else if (response.status === 409) {
        setContentErrorMessage({
          modalTitle: '이력서 등록 오류',
          modalContent: '이미 등록된 이력서가 있습니다.',
        });
        setIsResumeContentErrorModalOpen(true);
      } else {
        setContentErrorMessage({
          modalTitle: data.message
            ? '이력서 내용이 유효하지 않아요'
            : '이력서 등록 오류',
          modalContent: data.message
            ? '반복된 내용이 있어 올바른 작성이 필요해요.'
            : resumeId
              ? '이력서 수정에 실패했습니다.'
              : '이력서 등록에 실패했습니다.',
        });
        setIsResumeContentErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Resume submission error:', error);
      setContentErrorMessage({
        modalTitle: '이력서 등록 오류',
        modalContent: resumeId
          ? '이력서 수정 중 오류가 발생했습니다.'
          : '이력서 등록 중 오류가 발생했습니다.',
      });
      setIsResumeContentErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
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
            <h1 className={styles.title}>
              {resumeId ? '나의 이력서 수정하기' : '나의 이력서 만들기'}
            </h1>
            <Button variant="disabled" className={styles.pdfButton}>
              PDF로 불러오기
            </Button>
          </div>

          <div className={styles.content}>
            {isLoading && resumeId ? (
              <div className={styles.fullLoadingContainer}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>이력서를 불러오는 중...</p>
              </div>
            ) : (
              <>
                <div className={styles.resumeSection}>
                  <div className={styles.resumeHeader}>
                    <input
                      type="text"
                      className={styles.resumeTitleInput}
                      value={resumeTitle}
                      onChange={handleTitleChange}
                      maxLength={30}
                    />
                    <span className={styles.counter}>
                      {resumeTitle.length}/30
                    </span>
                  </div>
                </div>

                <div className={styles.inputSection}>
                  <textarea
                    className={styles.textarea}
                    placeholder="갖고 있는 이력서 내용을 복사/붙여넣기 하면 한번에 정리해드릴게요."
                    maxLength={5000}
                    value={resumeText}
                    onChange={handleTextChange}
                  />
                  <div className={styles.charCounter}>
                    <span>{resumeText.length}/5000</span>
                  </div>
                </div>
              </>
            )}

            <div className={styles.helpSection}>
              <ResumeHelper />
            </div>

            <button
              className={styles.completeButton}
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
            >
              <span className={styles.completeButtonText}>
                {isLoading
                  ? '불러오는 중...'
                  : isSubmitting
                    ? resumeId
                      ? '수정 중...'
                      : '등록 중...'
                    : '완료하기'}
              </span>
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <ConfirmModal
        isOpen={isResumeContentErrorModalOpen}
        onClose={() => setIsResumeContentErrorModalOpen(false)}
        onConfirm={() => setIsResumeContentErrorModalOpen(false)}
        title={contentErrorMessage.modalTitle}
        message={contentErrorMessage.modalContent}
        cancelText="확인"
        confirmText="다시 작성"
      />
      <ConfirmModal
        isOpen={isBackConfirmModalOpen}
        onClose={() => router.back()}
        onConfirm={() => setBackConfirmModalOpen(false)}
        title="이전 화면으로 가시겠어요?"
        message="작성 중인 내용이 모두 지워져요."
        cancelText="이전 화면"
        confirmText="계속 작성"
      />
    </>
  );
}

export default function CreateResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeCreateContent />
    </Suspense>
  );
}
