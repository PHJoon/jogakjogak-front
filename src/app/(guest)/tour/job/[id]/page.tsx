'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import calendarIcon from '@/assets/images/ic_calendar.svg';
import memoIcon from '@/assets/images/ic_memo.svg';
import plusGreenIcon from '@/assets/images/ic_plus_green.svg';
import plusPurpleIcon from '@/assets/images/ic_plus_purple.svg';
import plusYellowIcon from '@/assets/images/ic_plus_yellow.svg';
import progressIcon from '@/assets/images/ic_progress.svg';
import trophyIcon from '@/assets/images/ic_trophy.svg';
import Button from '@/components/common/Button';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import JobDetailSummaryBar from '@/components/jobDetail/JobDetailSummaryBar';
import JobDetailTopBar from '@/components/jobDetail/JobDetailTopBar';
import TourJogakTodoList from '@/components/tour/TourJogakTodoList';
import useClientMeta from '@/hooks/useClientMeta';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoItem } from '@/types/jds';

import styles from './page.module.css';

const TODO_CATEGORY_LIST = [
  {
    value: 'STRUCTURAL_COMPLEMENT_PLAN',
    label: '필요한 경험과 역량',
    color: '#F5E9FE',
    icon: trophyIcon,
    plusIcon: plusPurpleIcon,
  },
  {
    value: 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL',
    label: '내용 강조 및 재구성',
    color: '#FFF6CF',
    icon: memoIcon,
    plusIcon: plusYellowIcon,
  },
  {
    value: 'SCHEDULE_MISC_ERROR',
    label: '취업 일정 및 기타',
    color: '#DAF7F1',
    icon: calendarIcon,
    plusIcon: plusGreenIcon,
  },
  {
    value: 'COMPLETED_JOGAK',
    label: '완료한 조각',
    color: '',
    icon: progressIcon,
    plusIcon: null,
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const jdId = params.id as string;

  const [todosByCategory, setTodosByCategory] = useState<{
    [key: string]: TodoItem[];
  }>({});
  const [isJdDeleting, setIsJdDeleting] = useState(false);

  const {
    dummyJds,
    dummyJdDetails,
    updateDummyJdDetail,
    updateDummyJd,
    syncDummyJdAndJdDetail,
    setSnackbar,
    dummyCheckedTodoList,
    setDummyCheckedTodoList,
  } = useBoundStore(
    useShallow((state) => ({
      dummyJds: state.dummyJds,
      dummyJdDetails: state.dummyJdDetails,
      updateDummyJdDetail: state.updateDummyJdDetail,
      updateDummyJd: state.updateDummyJd,
      syncDummyJdAndJdDetail: state.syncDummyJdAndJdDetail,
      setSnackbar: state.setSnackbar,
      dummyCheckedTodoList: state.dummyCheckedTodoList,
      setDummyCheckedTodoList: state.setDummyCheckedTodoList,
    }))
  );

  const jdDetail = dummyJdDetails.find((jd) => jd.jd_id === Number(jdId));

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 분석 둘러보기 | 조각조각',
    'AI가 분석한 채용공고의 투두리스트를 확인하고 관리합니다.'
  );

  useEffect(() => {
    if (jdDetail) {
      const grouped = jdDetail.toDoLists.reduce(
        (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
          if (todo.done) {
            if (!acc['COMPLETED_JOGAK']) acc['COMPLETED_JOGAK'] = [];
            acc['COMPLETED_JOGAK'].push(todo);
            return acc;
          }
          if (!acc[todo.category]) acc[todo.category] = [];
          acc[todo.category].push(todo);
          return acc;
        },
        {}
      );
      setTodosByCategory(grouped);
    }
  }, [jdDetail, jdId]);

  // 알림 버튼 클릭 핸들러
  const handleAlarmButtonClick = () => {
    setSnackbar({
      message: '둘러보기에서는 투두 알림 설정이 불가능해요.',
      type: 'info',
    });
  };

  // 채용공고 보기 클릭 핸들러
  const handleClickJobUrl = () => {
    if (jdId && jdDetail) {
      if (jdDetail.jdUrl === '') {
        setSnackbar({
          message: '저장된 채용공고 링크가 없습니다.',
          type: 'error',
        });
        return;
      }
      window.open(jdDetail.jdUrl, '_blank');
    }
  };

  // 조각 완료하기 버튼 클릭 핸들러
  const handleClickTodoComplete = () => {
    console.log('완료할 todo 목록:', dummyCheckedTodoList);
    const increment = dummyCheckedTodoList.length;

    syncDummyJdAndJdDetail(Number(jdId), {
      completedPieces: jdDetail!.completedPieces + increment,
    });

    updateDummyJdDetail(Number(jdId), {
      toDoLists: jdDetail!.toDoLists.map((todo) =>
        dummyCheckedTodoList.includes(todo.checklist_id)
          ? { ...todo, done: true }
          : todo
      ),
    });

    setDummyCheckedTodoList([]);

    setSnackbar({
      message: '조각이 완료 처리되었어요!',
      type: 'success',
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.topBarContainer}>
        <div className={styles.topBar}>
          <JobDetailTopBar
            jdDetail={jdDetail!}
            handleClickJobUrl={handleClickJobUrl}
            toggleBookmark={() => {
              const originalState = jdDetail?.bookmark;
              syncDummyJdAndJdDetail(Number(jdId), {
                bookmark: !originalState,
              });
              setSnackbar({
                message: originalState
                  ? '관심공고에서 제외되었습니다.'
                  : '관심공고로 등록되었습니다.',
                type: 'success',
              });
            }}
            onSelect={(action) => {
              if (action === 'edit')
                return setSnackbar({
                  message: '둘러보기에서는 채용공고 수정이 불가능해요.',
                  type: 'info',
                });
              if (action === 'delete') return setIsJdDeleting(true);
              if (action === 'apply') {
                const originalState = jdDetail?.applyAt;
                syncDummyJdAndJdDetail(Number(jdId), {
                  applyAt: originalState ? null : new Date().toISOString(),
                });
                setSnackbar({
                  message: originalState
                    ? '지원 취소되었습니다.'
                    : '지원 완료되었습니다.',
                  type: 'success',
                });
              }
            }}
          />
        </div>
      </div>

      <div className={styles.content}>
        <JobDetailSummaryBar
          jdDetail={jdDetail!}
          handleAlarmButtonClick={handleAlarmButtonClick}
          isTogglingAlarm={false}
        />

        <div className={styles.todoListSection}>
          {TODO_CATEGORY_LIST.map(
            ({ value: category, label, color, icon, plusIcon }) => {
              const todoList = todosByCategory[category] || [];
              return (
                <TourJogakTodoList
                  key={category}
                  category={category}
                  label={label}
                  color={color}
                  icon={icon}
                  plusIcon={plusIcon}
                  todoList={todoList}
                  originalTodoList={jdDetail!.toDoLists}
                  jdId={Number(jdId)}
                />
              );
            }
          )}
        </div>

        {dummyCheckedTodoList.length > 0 && (
          <div className={styles.checkedConfirmation}>
            <div className={styles.checkedText}>
              해당 조각을 완료하셨나요?
              <span>합격에 한걸음 더 ! 🎉</span>
            </div>
            <div className={styles.checkedButton}>
              <Button
                onClick={handleClickTodoComplete}
                style={{ width: '100%', height: '48px' }}
              >
                완료하기
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isJdDeleting}
        onClose={() => setIsJdDeleting(false)}
        onConfirm={() => {
          setSnackbar({
            message: '둘러보기에서는 채용공고 삭제가 불가능해요.',
            type: 'info',
          });
        }}
        title="정말 삭제하시겠습니까?"
        message="저장한 내용이 모두 없어져요."
        cancelText="취소"
        confirmText="삭제"
        highlightedText="삭제"
      />
    </main>
  );
}
