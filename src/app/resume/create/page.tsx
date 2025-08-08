'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/Button';
import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import arrowDropDownIcon from '@/assets/images/ic_drop_down.svg';
import chatInfoIcon from '@/assets/images/ic_chat_info.svg';
import { tokenManager } from '@/utils/auth';
import { ConfirmModal } from '@/components/ConfirmModal';

function ResumeCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');
  const [resumeTitle, setResumeTitle] = useState('나의 이력서');
  const [resumeText, setResumeText] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/resume/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

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

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
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
      const accessToken = tokenManager.getAccessToken();
      const url = resumeId ? `/api/resume/${resumeId}` : '/api/resume';
      const method = resumeId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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
          modalContent:
            data.message ? '반복된 내용이 있어 올바른 작성이 필요해요.' :
            (resumeId
              ? '이력서 수정에 실패했습니다.'
              : '이력서 등록에 실패했습니다.'),
        });
        setIsResumeContentErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Resume submission error:', error);
      setContentErrorMessage({
        modalTitle: '이력서 등록 오류',
        modalContent:
          resumeId
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
      <Header
        backgroundColor='white'
        showLogout={true}
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              <Image
                src={arrowBackIcon}
                alt='뒤로가기'
                width={15.57}
                height={15.16}
              />
            </button>
            <h1 className={styles.title}>
              {resumeId ? '나의 이력서 수정하기' : '나의 이력서 만들기'}
            </h1>
            <Button
              variant='disabled'
              className={styles.pdfButton}
            >
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
                      type='text'
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
                    placeholder='갖고 있는 이력서 내용을 복사/붙여넣기 하면 한번에 정리해드릴게요.'
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
              <div
                className={styles.helpHeader}
                onClick={toggleHelp}
              >
                <div className={styles.helpContent}>
                  <Image
                    src={chatInfoIcon}
                    alt='도움말'
                    width={16.67}
                    height={15.51}
                    className={styles.helpIcon}
                  />
                  <span className={styles.helpText}>
                    {isHelpOpen
                      ? '이력서에 이런 내용을 포함하면 좋아요.'
                      : '이력서에 어떤걸 넣을지 모르겠나요?'}
                  </span>
                </div>
                <Image
                  src={arrowDropDownIcon}
                  alt='펼치기'
                  width={8.6}
                  height={4.7}
                  className={`${styles.dropdownIcon} ${
                    isHelpOpen ? styles.rotated : ''
                  }`}
                />
              </div>

              {isHelpOpen && (
                <div className={styles.helpExpanded}>
                  <div className={styles.helpGuide}>
                    <p>간단한 자기소개 문구</p>

                    <p>🎓 학력</p>
                    <p className={styles.helpSubtext}>
                      - 상태(재학 중 / 졸업 예정 / 졸업)
                    </p>
                    <p className={styles.helpSubtext}>
                      - 입학 년월 ~ 졸업 년월
                    </p>
                    <p className={styles.helpSubtext}>- 학교명</p>
                    <p className={styles.helpSubtext}>- 전공</p>

                    <p>🏅 어학 및 자격증</p>
                    <p className={styles.helpSubtext}>- 자격 명과 취득일</p>

                    <p>🧳 경력사항</p>
                    <p className={styles.helpSubtext}>- 상태(재직 중 / 퇴사)</p>
                    <p className={styles.helpSubtext}>
                      - 입사 년월 ~ 퇴사 년월
                    </p>
                    <p className={styles.helpSubtext}>- 회사명</p>
                    <p className={styles.helpSubtext}>- 부서명</p>
                    <p className={styles.helpSubtext}>- 업무 역할</p>

                    <p>🏆 수상 및 대외활동</p>
                    <p className={styles.helpSubtext}>- 연도</p>
                    <p className={styles.helpSubtext}>- 활동명 or 수상내역</p>

                    <p>📁 상세 경력 Or 프로젝트 경험</p>
                    <p className={styles.helpSubtext}>- 업체명 / 프로젝트명</p>
                    <p className={styles.helpSubtext}>- 프로젝트 소개</p>
                    <p className={styles.helpSubtext}>- 본인의 역할</p>
                    <p className={styles.helpSubtext}>
                      - 수행 내용(업무 과정, 기여 성과 등)
                    </p>

                    <p>💻 보유 능력 / 스킬</p>
                    <p className={styles.helpSubtext}>
                      - 주요 기술 및 툴: (예: Python, Excel, Adobe XD 등)
                    </p>

                    <p>✍️ 나의 장단점 작성</p>
                    <p className={styles.helpSubtext}>- 강점:</p>
                    <p className={styles.helpSubtext}>- 보완할 점:</p>
                  </div>
                </div>
              )}
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
        cancelText='확인'
        confirmText='다시 작성'
      />
      <ConfirmModal
        isOpen={isBackConfirmModalOpen}
        onClose={() => router.back()}
        onConfirm={() => setBackConfirmModalOpen(false)}
        title='이전 화면으로 가시겠어요?'
        message='작성 중인 내용이 모두 지워져요.'
        cancelText='이전 화면'
        confirmText='계속 작성'
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
