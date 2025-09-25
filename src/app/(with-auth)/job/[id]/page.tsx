'use client';

import { useParams, useRouter } from 'next/navigation';
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
import JobDetailLoading from '@/components/jobDetail/JobDetailLoading';
import JobDetailSummaryBar from '@/components/jobDetail/JobDetailSummaryBar';
import JobDetailTopBar from '@/components/jobDetail/JobDetailTopBar';
import JogakTodoList from '@/components/jobDetail/JogakTodoList';
import NotificationModal from '@/components/NotificationModal';
import { ERROR_CODES } from '@/constants/errorCode';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJobActions from '@/hooks/job/useJobActions';
import useDeleteJdMutation from '@/hooks/mutations/job/useDeleteJdMutation';
import useToggleCompleteMultipleTodoMutation from '@/hooks/mutations/job_todolist/useToggleCompleteMultipleTodoMutation';
import useUpdateTodoAlarmMutation from '@/hooks/mutations/job_todolist/useUpdateTodoAlarmMutation';
import useJdQuery from '@/hooks/queries/useJdQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';
import { JDDetail, TodoItem } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

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
  const router = useRouter();
  const params = useParams();
  const jdId = params.id as string;

  const [jdDetail, setJdDetail] = useState<JDDetail | null>(null);
  const [todosByCategory, setTodosByCategory] = useState<{
    [key: string]: TodoItem[];
  }>({});
  const [isTogglingAlarm, setIsTogglingAlarm] = useState(false);
  const [isJdDeleting, setIsJdDeleting] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const { checkedTodoList, clearCheckedTodo, setSnackbar } = useBoundStore(
    useShallow((state) => ({
      checkedTodoList: state.checkedTodoList,
      clearCheckedTodo: state.clearCheckedTodo,
      setSnackbar: state.setSnackbar,
    }))
  );

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 분석 | 조각조각',
    'AI가 분석한 채용공고의 투두리스트를 확인하고 관리합니다.'
  );

  const { deleteJdMutate } = useDeleteJdMutation();
  const { updateTodoAlarmMutate } = useUpdateTodoAlarmMutation();
  const {
    toggleCompleteMultipleTodoMutate,
    isToggleCompleteMultipleTodoPending,
  } = useToggleCompleteMultipleTodoMutation();

  const { data: jdData, isLoading: isJdLoading } = useJdQuery({
    jobId: Number(jdId),
    isJdDeleting: isJdDeleting,
  });

  useEffect(() => {
    if (jdData) {
      setJdDetail(jdData);
      const grouped = jdData.toDoLists.reduce(
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
  }, [jdData]);

  // 알림 버튼 클릭 핸들러
  const handleAlarmButtonClick = () => {
    setShowNotificationModal(true);
  };

  // 알림 모달 확인 핸들러
  const handleNotificationConfirm = async (isEnabled: boolean) => {
    setShowNotificationModal(false);
    trackEvent({
      event: GAEvent.JobPosting.ALARM_TOGGLE,
      event_category: GACategory.JOB_POSTING,
      alarm_status: isEnabled,
      jobId: jdDetail?.jd_id,
    });

    if (!jdDetail || isTogglingAlarm) return;

    // 알림 상태가 변경되는 경우에만 API 호출
    if (jdDetail.alarmOn !== isEnabled) {
      setIsTogglingAlarm(true);

      updateTodoAlarmMutate(
        { jdId: jdDetail.jd_id, newAlarmState: isEnabled },
        {
          onSettled: () => {
            setIsTogglingAlarm(false);
          },
        }
      );
    }
  };

  // 채용공고 삭제 핸들러
  const handleJobDelete = () => {
    setIsJdDeleting(true);
    trackEvent({
      event: GAEvent.JobPosting.REMOVE,
      event_category: GACategory.JOB_POSTING,
      jobId: Number(jdId),
    });
    deleteJdMutate(Number(jdId), {
      onSuccess: () => {
        router.replace('/dashboard');
      },
      onError: (error) => {
        if (error instanceof HttpError) {
          if (error.errorCode === ERROR_CODES.REPLAY_REQUIRED) {
            return;
          }
        }
        setIsJdDeleting(false);
      },
    });
  };

  // 채용공고 보기 클릭 핸들러
  const handleClickJobUrl = () => {
    if (jdDetail) {
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

  const { handleJobEdit, handleMarkAsApplied, handleBookmarkToggle } =
    useJobActions();

  const handleClickTodoComplete = () => {
    toggleCompleteMultipleTodoMutate(
      {
        jdId: Number(jdId),
        toDoListIds: checkedTodoList,
      },
      {
        onSuccess: () => {
          setSnackbar({
            type: 'success',
            message: '조각이 완료 처리되었어요!',
          });
          clearCheckedTodo();
        },
      }
    );
  };

  if (isJdLoading) {
    return <JobDetailLoading />;
  }

  if (!jdDetail) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: '25px',
              paddingTop: '150px',
              gap: '40px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '25px',
                padding: '20px',
              }}
            >
              채용공고를 찾을 수 없습니다.
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              style={{ width: '300px', height: '60px' }}
            >
              돌아가기
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <JobDetailTopBar
        jdDetail={jdDetail}
        handleClickJobUrl={handleClickJobUrl}
        toggleBookmark={() =>
          handleBookmarkToggle(jdDetail?.jd_id, !jdDetail?.bookmark)
        }
        onSelect={(action) => {
          if (action === 'edit') return handleJobEdit(jdDetail?.jd_id);
          if (action === 'delete') return setIsJdDeleting(true);
          if (action === 'apply')
            return handleMarkAsApplied(jdDetail?.jd_id, jdDetail?.applyAt);
        }}
      />

      <div className={styles.content}>
        <JobDetailSummaryBar
          jdDetail={jdDetail}
          handleAlarmButtonClick={handleAlarmButtonClick}
          isTogglingAlarm={isTogglingAlarm}
        />

        <div className={styles.todoListSection}>
          {TODO_CATEGORY_LIST.map(
            ({ value: category, label, color, icon, plusIcon }) => {
              const todoList = todosByCategory[category] || [];
              return (
                <JogakTodoList
                  key={category}
                  category={category}
                  label={label}
                  color={color}
                  icon={icon}
                  plusIcon={plusIcon}
                  todoList={todoList}
                />
              );
            }
          )}
        </div>

        {checkedTodoList.length > 0 && (
          <div className={styles.checkedConfirmation}>
            <div className={styles.checkedText}>
              해당 조각을 완료하셨나요?
              <span>합격에 한걸음 더 ! 🎉</span>
            </div>
            <Button
              onClick={handleClickTodoComplete}
              disabled={isToggleCompleteMultipleTodoPending}
              isLoading={isToggleCompleteMultipleTodoPending}
              style={{ width: '220px', height: '48px' }}
            >
              완료하기
            </Button>
          </div>
        )}
      </div>
      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isJdDeleting}
        onClose={() => setIsJdDeleting(false)}
        onConfirm={handleJobDelete}
        title="정말 삭제하시겠습니까?"
        message="저장한 내용이 모두 없어져요."
        cancelText="취소"
        confirmText="삭제"
        highlightedText="삭제"
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onConfirm={handleNotificationConfirm}
        initialEnabled={jdDetail.alarmOn}
      />
    </main>
  );
}
