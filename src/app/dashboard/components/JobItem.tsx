'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useReducer, useState, useRef, useEffect } from 'react';

import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import bookmarkCheckIcon from '@/assets/images/ic_bookmark_check.svg';
import kebabIcon from '@/assets/images/ic_kebab.svg';
import { DDayChip } from '@/components/DDayChip';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ProgressBar } from '@/components/ProgressBar';
import Snackbar from '@/components/Snackbar';
import useJdsMutation from '@/hooks/mutations/useJdsMutation';
import { JobDescription } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';
import { formatDate } from '@/utils/formatDate';

import styles from './JobItem.module.css';

interface Props {
  jd: JobDescription;
  state?: 'default' | 'done' | 'dayover' | 'hover';
  className?: string;
}

interface State {
  state: string;
  originalState: string;
}

function reducer(state: State, action: string): State {
  switch (action) {
    case 'mouse_enter':
      return {
        ...state,
        state: 'hover',
      };
    case 'mouse_leave':
      return {
        ...state,
        state: state.originalState,
      };
  }
  return state;
}

export default function JobItem({
  jd,
  state: stateProp = 'default',
  className = '',
}: Props) {
  const dDay = calculateDDay(jd.endedAt);

  const jdState = jd.applyAt
    ? 'done'
    : dDay && dDay < 0
      ? 'dayover'
      : 'default';

  const [state, dispatch] = useReducer(reducer, {
    state: jdState,
    originalState: jdState,
  });
  const router = useRouter();
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const { deleteMutate, applyMutate, bookmarkMutate } = useJdsMutation();

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleJobClick = () => {
    router.push(`/job/${jd.jd_id}`);
  };

  // 채용공고 삭제 핸들러
  const handleJobDelete = async (jobId: number | null) => {
    if (!jobId) return;

    deleteMutate(jobId, {
      onSuccess: () => {
        setSnackbar({
          isOpen: true,
          message: '채용공고가 삭제되었습니다.',
          type: 'success',
        });
      },
      onError: (error) => {
        setSnackbar({
          isOpen: true,
          message: error.message,
          type: 'error',
        });
      },
    });
  };

  // 지원 완료 핸들러
  const handleMarkAsApplied = async (
    jobId: number | null,
    applyAt: string | null
  ) => {
    if (!jobId) return;

    applyMutate(jobId, {
      onSuccess: () => {
        setSnackbar({
          isOpen: true,
          message: applyAt ? '지원 취소되었습니다.' : '지원 완료되었습니다.',
          type: 'success',
        });
      },
      onError: (error) => {
        setSnackbar({
          isOpen: true,
          message: error.message,
          type: 'error',
        });
      },
    });
  };

  // 즐겨찾기 핸들러
  const handleBookmarkToggle = async (
    jobId: number | null,
    newBookmarkState: boolean
  ) => {
    if (!jobId) return;

    bookmarkMutate(
      { jobId, newBookmarkState },
      {
        onSuccess: () => {
          setSnackbar({
            isOpen: true,
            message: newBookmarkState
              ? '관심공고로 등록되었습니다.'
              : '관심공고에서 제외되었습니다.',
            type: 'success',
          });
        },
        onError: (error) => {
          setSnackbar({
            isOpen: true,
            message: error.message,
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <>
      <div
        className={`${styles.item} ${styles[`state-${state.state}`]} ${className}`}
        onMouseEnter={() => dispatch('mouse_enter')}
        onMouseLeave={() => dispatch('mouse_leave')}
        onClick={handleJobClick}
      >
        <div className={styles.itemInner}>
          <div className={styles.itemMain}>
            <div className={styles.itemTopBar}>
              <div className={styles.dDayChipWrapper}>
                <DDayChip
                  alarmOn={jd.alarmOn}
                  isApplied={Boolean(jd.applyAt)}
                  dDay={dDay}
                />
              </div>

              <div className={styles.menuWrapper} ref={moreMenuRef}>
                <button
                  className={styles.menuTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(jd.jd_id, !jd.bookmark);
                  }}
                >
                  {jd.bookmark ? (
                    <Image
                      src={bookmarkCheckIcon}
                      alt="add-bookmark"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src={bookmarkIcon}
                      alt="add-bookmark"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
                <button
                  className={styles.menuTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreMenu(!showMoreMenu);
                  }}
                >
                  <Image
                    src={kebabIcon}
                    alt="more-options"
                    width={24}
                    height={24}
                  />
                </button>

                {/* More menu dropdown */}
                {showMoreMenu && (
                  <div className={styles.menuDropdown}>
                    <button className={`${styles.menuItem} ${styles.edit}`}>
                      공고 수정
                    </button>
                    <button
                      className={`${styles.menuItem} ${styles.apply}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreMenu(false);
                        handleMarkAsApplied(jd.jd_id, jd.applyAt);
                      }}
                    >
                      {!Boolean(jd.applyAt) ? '지원 완료' : '지원 완료 취소'}
                    </button>
                    <button
                      className={`${styles.menuItem} ${styles.delete}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreMenu(false);
                        setShowDeleteConfirmModal(true);
                      }}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.itemBody}>
              <div className={styles.titleRow}>
                <div className={styles.title}>{jd.title}</div>
              </div>
              <div className={styles.company}>{jd.companyName}</div>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressText}>
              <div className={styles.progressLabel}>완료한 조각</div>
              <div className={styles.progressCount}>
                <span className={styles.count}>
                  <span
                    className={`${styles.countDone} ${jdState === 'dayover' ? styles.dayover : ''}`}
                  >
                    {jd.completed_pieces}
                  </span>
                  <span className={styles.countTotal}>
                    {' '}
                    / {jd.total_pieces}
                  </span>
                </span>
              </div>
            </div>

            <ProgressBar
              total={jd.total_pieces}
              completed={jd.completed_pieces}
              className={styles.progressBar}
              isDayover={jdState === 'dayover'}
            />
          </div>
        </div>

        <div className={styles.itemBottom}>
          <div className={styles.registerDateLabel}>등록일</div>
          <div className={styles.registerDate}>{formatDate(jd.createdAt)}</div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={() => handleJobDelete(jd.jd_id)}
        title="정말 삭제하시겠습니까?"
        message="저장한 내용이 모두 없어져요."
        cancelText="취소"
        confirmText="삭제"
        highlightedText="삭제"
      />

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        type={snackbar.type}
        duration={1000}
      />
    </>
  );
}
