'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

import { ConfirmModal } from '@/components/ConfirmModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import useResumeForm from '@/hooks/resume/useResumeForm';
import useResumeModal from '@/hooks/resume/useResumeModal';
import useResumeValidation from '@/hooks/resume/useResumeValidation';
import useClientMeta from '@/hooks/useClientMeta';

import ResumeFormHeader from './components/ResumeFormHeader';
import ResumeFormInput from './components/ResumeFormInput';
import ResumeHelper from './components/ResumeHelper';
import ResumeLoading from './components/ResumeLoading';
import styles from './page.module.css';

function ResumeCreateContent() {
  const router = useRouter();

  const {
    resumeId,
    resumeTitle,
    resumeContent,
    setResumeTitle,
    setResumeContent,
    hasUnsavedChanges,
    isExistingResumeLoading,
    createMutate,
    isCreatePending,
    updateMutate,
    isUpdatePending,
  } = useResumeForm();

  const {
    isResumeErrorModalOpen,
    isBackConfirmModalOpen,
    resumeErrorMessage,
    showResumeErrorModal,
    closeResumeErrorModal,
    showBackConfirmModal,
    closeBackConfirmModal,
  } = useResumeModal();

  const { validateResume, handleError } = useResumeValidation(
    hasUnsavedChanges,
    showResumeErrorModal
  );

  const handleBack = () => {
    if (hasUnsavedChanges) {
      showBackConfirmModal();
      return;
    }
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateResume(resumeTitle, resumeContent)) return;

    if (resumeId) {
      // 수정
      updateMutate(
        { resumeId, title: resumeTitle, content: resumeContent },
        {
          onSuccess: () => {
            alert(`이력서가 수정되었습니다.`);
            router.replace('/dashboard');
          },
          onError: handleError,
        }
      );
    } else {
      // 등록
      createMutate(
        { title: resumeTitle, content: resumeContent },
        {
          onSuccess: () => {
            alert(`이력서가 등록되었습니다.`);
            router.replace('/dashboard');
          },
          onError: handleError,
        }
      );
    }
  };

  // 클라이언트 메타 설정
  useClientMeta(
    `이력서 ${resumeId ? '수정' : '등록'} | 조각조각`,
    `이력서를 ${resumeId ? '수정' : '등록'}합니다.`
  );

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

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <ResumeFormHeader
            title={resumeId ? '나의 이력서 수정하기' : '나의 이력서 만들기'}
            handleBack={handleBack}
          />

          <div className={styles.content}>
            {isExistingResumeLoading && resumeId ? (
              <ResumeLoading />
            ) : (
              <ResumeFormInput
                resumeTitle={resumeTitle}
                resumeContent={resumeContent}
                setResumeTitle={setResumeTitle}
                setResumeContent={setResumeContent}
              />
            )}

            <div className={styles.helpSection}>
              <ResumeHelper />
            </div>

            <button
              className={styles.completeButton}
              onClick={handleSubmit}
              disabled={
                isCreatePending || isUpdatePending || isExistingResumeLoading
              }
            >
              <span className={styles.completeButtonText}>
                {isExistingResumeLoading && '불러오는 중...'}
                {isCreatePending && '등록 중...'}
                {isUpdatePending && '수정 중...'}
                {!isExistingResumeLoading &&
                  !isCreatePending &&
                  !isUpdatePending &&
                  '완료하기'}
              </span>
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <ConfirmModal
        isOpen={isResumeErrorModalOpen}
        onClose={closeResumeErrorModal}
        onConfirm={closeResumeErrorModal}
        title={resumeErrorMessage.modalTitle}
        message={resumeErrorMessage.modalContent}
        cancelText="확인"
        confirmText="다시 작성"
      />
      <ConfirmModal
        isOpen={isBackConfirmModalOpen}
        onClose={() => router.back()}
        onConfirm={closeBackConfirmModal}
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
