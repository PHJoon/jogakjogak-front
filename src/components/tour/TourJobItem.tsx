'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useReducer, useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import bookmarkCheckIcon from '@/assets/images/ic_bookmark_check.svg';
import kebabIcon from '@/assets/images/ic_kebab.svg';
import { DDayChip } from '@/components/DDayChip';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ProgressBar } from '@/components/ProgressBar';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobDescription } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';
import { formatDate } from '@/utils/formatDate';

import JobActionMenu from '../JobActionMenu';

import styles from './TourJobItem.module.css';

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

export default function TourJobItem({
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
  const {
    setSnackbar,
    updateDummyJd,
    updateDummyJdDetail,
    syncDummyJdAndJdDetail,
  } = useBoundStore(
    useShallow((state) => ({
      setSnackbar: state.setSnackbar,
      updateDummyJd: state.updateDummyJd,
      updateDummyJdDetail: state.updateDummyJdDetail,
      syncDummyJdAndJdDetail: state.syncDummyJdAndJdDetail,
    }))
  );

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
    router.push(`/tour/job/${jd.jd_id}`);
  };

  const handleBookmarkToggle = () => {
    const originalState = jd.bookmark;
    syncDummyJdAndJdDetail(jd.jd_id, { bookmark: !jd.bookmark });
    setSnackbar({
      message: originalState
        ? '관심공고에서 제외되었습니다.'
        : '관심공고로 등록되었습니다.',
      type: 'success',
    });
  };

  const handleMarkAsApplied = () => {
    const originalState = jd.applyAt;
    const currentDateISO = new Date().toISOString();
    syncDummyJdAndJdDetail(jd.jd_id, {
      applyAt: jd.applyAt ? null : currentDateISO,
    });
    setSnackbar({
      message: originalState ? '지원 취소되었습니다.' : '지원 완료되었습니다.',
      type: 'success',
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
                    handleBookmarkToggle();
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
                          setSnackbar({
                            message:
                              '둘러보기에서는 수정 기능을 사용할 수 없습니다.',
                            type: 'info',
                          });
                        }
                        if (action === 'apply') {
                          handleMarkAsApplied();
                        }
                        if (action === 'delete') {
                          setShowDeleteConfirmModal(true);
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
        onConfirm={() =>
          setSnackbar({
            message: '둘러보기에서는 삭제 기능을 사용할 수 없습니다.',
            type: 'info',
          })
        }
        title="정말 삭제하시겠습니까?"
        message="저장한 내용이 모두 없어져요."
        cancelText="취소"
        confirmText="삭제"
        highlightedText="삭제"
      />
    </>
  );
}
