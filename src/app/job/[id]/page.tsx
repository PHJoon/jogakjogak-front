'use client';

import { StaticImageData } from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import contentEmphasisIcon from '@/assets/images/content-emphasis-and-reorganization.svg';
import scheduleIcon from '@/assets/images/employment-schedule-and-others.svg';
import { Button } from '@/components/Button';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import JobDetailLoading from '@/components/jobDetail/JobDetailLoading';
import JobDetailSection from '@/components/jobDetail/JobDetailSection';
import JobDetailTopBar from '@/components/jobDetail/JobDetailTopBar';
import ProgressNotificationSection from '@/components/jobDetail/ProgressNotificationSection';
import { JogakCategory } from '@/components/JogakCategory';
import { MemoBox } from '@/components/MemoBox';
import NotificationModal from '@/components/NotificationModal';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJobActions from '@/hooks/job/useJobActions';
import useDeleteJdMutation from '@/hooks/mutations/job/useDeleteJdMutation';
import useCreateTodoMutation from '@/hooks/mutations/job_todolist/useCreateTodoMutation';
import useDeleteTodoMutation from '@/hooks/mutations/job_todolist/useDeleteTodoMutation';
import useUpdateTodoAlarmMutation from '@/hooks/mutations/job_todolist/useUpdateTodoAlarmMutation';
import useUpdateTodoMutation from '@/hooks/mutations/job_todolist/useUpdateTodoMutation';
import useJdQuery from '@/hooks/queries/useJdQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { useBoundStore } from '@/stores/useBoundStore';
import { JDDetail, TodoItem } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

const CATEGORY_TITLES: { [key: string]: string } = {
  STRUCTURAL_COMPLEMENT_PLAN: '필요한 경험과 역량',
  CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL: '내용 강조 및 재구성',
  SCHEDULE_MISC_ERROR: '취업 일정 및 기타',
};

const CATEGORIES = [
  { value: 'STRUCTURAL_COMPLEMENT_PLAN', label: '필요한 경험과 역량' },
  {
    value: 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL',
    label: '내용 강조 및 재구성',
  },
  { value: 'SCHEDULE_MISC_ERROR', label: '취업 일정 및 기타' },
];

const CATEGORY_COLORS: { [key: string]: string } = {
  STRUCTURAL_COMPLEMENT_PLAN: '#D9A9F9',
  CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL: '#FFD00E',
  SCHEDULE_MISC_ERROR: '#3DC3A9',
};

const CATEGORY_ICONS: { [key: string]: StaticImageData } = {
  CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL: contentEmphasisIcon,
  SCHEDULE_MISC_ERROR: scheduleIcon,
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jdId = params.id as string;

  const [jdDetail, setJdDetail] = useState<JDDetail | null>(null);
  const [todosByCategory, setTodosByCategory] = useState<{
    [key: string]: TodoItem[];
  }>({});
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  const memoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTogglingAlarm, setIsTogglingAlarm] = useState(false);
  const [isJdDeleting, setIsJdDeleting] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 분석 | 조각조각',
    'AI가 분석한 채용공고의 투두리스트를 확인하고 관리합니다.'
  );

  const { deleteJdMutate } = useDeleteJdMutation();
  const { createTodoMutate } = useCreateTodoMutation();
  const { deleteTodoMutate } = useDeleteTodoMutation();
  const { updateTodoMutate } = useUpdateTodoMutation();
  const { updateTodoAlarmMutate } = useUpdateTodoAlarmMutation();

  const { data: jdData, isLoading: isJdLoading } = useJdQuery({
    jobId: Number(jdId),
    isJdDeleting: isJdDeleting,
  });

  useEffect(() => {
    if (jdData) {
      setJdDetail(jdData);
      const grouped = jdData.toDoLists.reduce(
        (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
          if (!acc[todo.category]) acc[todo.category] = [];
          acc[todo.category].push(todo);
          return acc;
        },
        {}
      );
      setTodosByCategory(grouped);
    }
  }, [jdData]);

  // 디바운스된 메모 저장 함수
  const saveMemo = useCallback(
    async (memoText: string) => {
      try {
        setIsSavingMemo(true);
        const response = await fetchWithAuth(`/api/jds/${jdId}/memo`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memo: memoText }),
        });

        if (!response.ok) {
          console.error('Failed to save memo');
        }
      } catch (error) {
        console.error('Error saving memo:', error);
      } finally {
        setIsSavingMemo(false);
      }
    },
    [jdId]
  );

  // 메모 변경 핸들러 (디바운스 적용)
  const handleMemoChange = useCallback(
    (value: string) => {
      // 이전 타이머 취소
      if (memoTimeoutRef.current) {
        clearTimeout(memoTimeoutRef.current);
      }

      // 로컬 상태 즉시 업데이트
      if (jdDetail) {
        setJdDetail({ ...jdDetail, memo: value });
      }

      // 0.8초 후 저장
      memoTimeoutRef.current = setTimeout(() => {
        saveMemo(value);
      }, 800);
    },
    [jdDetail, saveMemo]
  );

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
          onError: (error) => {
            setSnackbar({
              type: 'error',
              message: error.message || '알림 설정 중 오류가 발생했습니다.',
            });
          },
          onSettled: () => {
            setIsTogglingAlarm(false);
          },
        }
      );
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (memoTimeoutRef.current) {
        clearTimeout(memoTimeoutRef.current);
      }
    };
  }, []);

  // Todo 완료 상태 토글
  const toggleTodoComplete = async (todo: TodoItem, newStatus: boolean) => {
    trackEvent({
      event: GAEvent.TodoList.TOGGLE_TODO,
      event_category: GACategory.TODO,
      todo_status: newStatus,
      jobId: todo.jdId,
    });

    updateTodoMutate(
      {
        jdId: todo.jdId,
        todoId: todo.checklist_id,
        updateTodoItem: {
          category: todo.category,
          title: todo.title,
          content: todo.content,
          is_done: newStatus,
        },
      },
      {
        onError: (error) => {
          setSnackbar({
            type: 'error',
            message: error.message || '조각 상태 업데이트 중 오류 발생',
          });
        },
      }
    );
  };

  // Todo 수정 함수
  const editTodo = async (
    todoId: string,
    data: { category: string; title: string; content: string }
  ) => {
    trackEvent({
      event: GAEvent.TodoList.EDIT_TODO,
      event_category: GACategory.TODO,
      jobId: jdDetail?.jd_id,
    });

    const currentTodo = jdDetail?.toDoLists.find(
      (todo) => todo.checklist_id.toString() === todoId
    );
    const isDone = currentTodo?.done || false;
    updateTodoMutate(
      {
        jdId: Number(jdId),
        todoId: Number(todoId),
        updateTodoItem: {
          category: data.category,
          title: data.title,
          content: data.content,
          is_done: isDone,
        },
      },
      {
        onError: (error) => {
          setSnackbar({
            type: 'error',
            message: error.message || '조각 내용 수정 중 오류가 발생했습니다.',
          });
        },
      }
    );
  };

  // Todo 삭제 함수
  const deleteTodo = async (todoId: string) => {
    trackEvent({
      event: GAEvent.TodoList.DELETE_TODO,
      event_category: GACategory.TODO,
      jobId: jdDetail?.jd_id,
    });

    deleteTodoMutate(
      {
        jdId: Number(jdId),
        todoId: Number(todoId),
      },
      {
        onError: (error) => {
          setSnackbar({
            type: 'error',
            message: error.message || '조각 삭제 중 오류가 발생했습니다.',
          });
        },
      }
    );
  };

  // Todo 추가 함수
  const addTodo = async (data: {
    category: string;
    title: string;
    content: string;
  }) => {
    trackEvent({
      event: GAEvent.TodoList.ADD_TODO,
      event_category: GACategory.TODO,
      jobId: jdDetail?.jd_id,
    });

    createTodoMutate(
      {
        jdId: Number(jdId),
        newTodoItem: {
          category: data.category,
          title: data.title,
          content: data.content,
        },
      },
      {
        onError: (error) => {
          setSnackbar({
            type: 'error',
            message: error.message || '조각 추가 중 오류가 발생했습니다.',
          });
        },
      }
    );
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
        setSnackbar({
          message: error.message,
          type: 'error',
        });
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

  // 조각 완료 현황 계산
  const { completed, total } = useMemo(() => {
    const list = jdDetail?.toDoLists ?? [];
    let done = 0;
    for (const t of list) if (t.done) done++;
    return { completed: done, total: list.length };
  }, [jdDetail?.toDoLists]);

  if (isJdLoading) {
    return <JobDetailLoading />;
  }

  if (!jdDetail) {
    return (
      <>
        <Header backgroundColor="white" showLogout={true} />
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
                padding: '100px',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '25px',
                  padding: '100px',
                }}
              >
                채용공고를 찾을 수 없습니다.
              </div>
              <Button onClick={() => router.push('/dashboard')}>
                돌아가기
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
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

        <div className={styles.container}>
          {/* Header with navigation */}

          {/* Job details */}
          <JobDetailSection jdDetail={jdDetail} />

          {/* Progress tracker */}
          <ProgressNotificationSection
            completed={completed}
            total={total}
            handleAlarmButtonClick={handleAlarmButtonClick}
            isTogglingAlarm={isTogglingAlarm}
            isAlarmOn={jdDetail.alarmOn}
          />

          {/* Jogak Categories */}
          <div className={styles.jogakCategories}>
            {CATEGORIES.map(({ value: category }) => {
              const todos = todosByCategory[category] || [];
              return (
                <JogakCategory
                  key={category}
                  state="active"
                  title={CATEGORY_TITLES[category] || category}
                  initialItems={todos.map((todo) => ({
                    id: todo.checklist_id.toString(),
                    text: todo.title,
                    completed: todo.done,
                    content: todo.content,
                    fullTodo: todo,
                  }))}
                  checkboxColor={CATEGORY_COLORS[category]}
                  icon={CATEGORY_ICONS[category]}
                  className={styles.jogakCategoryInstance}
                  category={category}
                  categories={CATEGORIES}
                  onItemToggle={(itemId) => {
                    const todo = todos.find(
                      (t) => t.checklist_id.toString() === itemId
                    );
                    if (todo) {
                      toggleTodoComplete(todo, !todo.done);
                    }
                  }}
                  onItemEdit={(itemId, data) => {
                    editTodo(itemId, data);
                  }}
                  onItemDelete={(itemId) => {
                    deleteTodo(itemId);
                  }}
                  onItemAdd={(data) => {
                    addTodo(data);
                  }}
                />
              );
            })}
          </div>

          {/* Memo Box */}
          <MemoBox
            placeholder="해당 조각에 대해 메모해보세요."
            maxLength={1000}
            className={styles.memoBoxInstance}
            initialValue={jdDetail.memo || ''}
            onChange={handleMemoChange}
          />
          {isSavingMemo && (
            <div
              style={{
                textAlign: 'right',
                marginTop: '4px',
                fontSize: '12px',
                color: '#999',
              }}
            >
              저장 중...
            </div>
          )}
        </div>
      </main>
      <Footer />

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
    </>
  );
}
