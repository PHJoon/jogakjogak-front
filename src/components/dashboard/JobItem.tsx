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
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJobActions from '@/hooks/job/useJobActions';
import useDeleteJdMutation from '@/hooks/mutations/job/useDeleteJdMutation';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';
import { formatDate } from '@/utils/formatDate';
import trackEvent from '@/utils/trackEventGA';

import JobActionMenu from '../JobActionMenu';

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const { deleteJdMutate } = useDeleteJdMutation();
  const { handleJobEdit, handleMarkAsApplied, handleBookmarkToggle } =
    useJobActions();

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  const handleJobClick = () => {
    router.push(`/job/${jd.jd_id}`);
  };

  // 채용공고 삭제 핸들러
  const handleJobDelete = async (jobId: number | null) => {
    if (!jobId) return;

    trackEvent({
      event: GAEvent.JobPosting.REMOVE,
      event_category: GACategory.JOB_POSTING,
      jobId: jobId,
    });

    deleteJdMutate(jobId, {
      onSuccess: () => {
        setSnackbar({
          message: '채용공고가 삭제되었습니다.',
          type: 'success',
        });
      },
    });
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

              <div className={styles.menuWrapper}>
                <button
                  className={styles.menuTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(jd.jd_id, !jd.bookmark);
                  }}
                >
                  <Image
                    src={jd.bookmark ? bookmarkCheckIcon : bookmarkIcon}
                    alt="add-bookmark"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className={styles.menuTrigger}
                  ref={buttonRef}
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
                  <div className={styles.moreMenuWrapper} ref={menuRef}>
                    <JobActionMenu
                      applyStatus={!!jd.applyAt}
                      onSelect={(action) => {
                        if (action === 'edit') {
                          handleJobEdit(jd.jd_id);
                        }
                        if (action === 'apply') {
                          handleMarkAsApplied(jd.jd_id, jd.applyAt);
                        }
                        if (action === 'delete') {
                          handleJobDelete(jd.jd_id);
                        }
                      }}
                    />
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
                    {jd.completedPieces}
                  </span>
                  <span className={styles.countTotal}> / {jd.totalPieces}</span>
                </span>
              </div>
            </div>

            <ProgressBar
              total={jd.totalPieces}
              completed={jd.completedPieces}
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
    </>
  );
}
