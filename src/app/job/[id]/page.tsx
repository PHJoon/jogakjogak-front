'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProgressBar } from '@/components/ProgressBar';
import { DDayChip } from '@/components/DDayChip';
import { JogakCategory } from '@/components/JogakCategory';
import { MemoBox } from '@/components/MemoBox';
import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import alarmIcon from '@/assets/images/ic_alarm.svg';
import bookmarkIcon from '@/assets/images/ic_add_to_bookmark.svg';
import moreIcon from '@/assets/images/ic_more.svg';
import contentEmphasisIcon from '@/assets/images/content-emphasis-and-reorganization.svg';
import scheduleIcon from '@/assets/images/employment-schedule-and-others.svg';
import { tokenManager } from '@/utils/auth';
import NotificationModal from '@/components/NotificationModal';
import Snackbar from '@/components/Snackbar';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { calculateDDay } from '@/utils/calculateDDay';

interface TodoItem {
  checklist_id: number;
  category: string;
  title: string;
  content: string;
  memo: string;
  jdId: number;
  createdAt: string;
  updatedAt: string;
  done: boolean;
}

interface JDDetail {
  jd_id: number;
  title: string;
  bookmark: boolean;
  companyName: string;
  job: string;
  content: string;
  jdUrl: string;
  memo: string;
  memberId: number;
  alarmOn: boolean;
  applyAt: string | null;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
  toDoLists: TodoItem[];
}

const CATEGORY_TITLES: { [key: string]: string } = {
  'STRUCTURAL_COMPLEMENT_PLAN': '필요한 경험과 역량',
  'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL': '내용 강조 및 재구성',
  'SCHEDULE_MISC_ERROR': '취업 일정 및 기타',
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
  'STRUCTURAL_COMPLEMENT_PLAN': '#D9A9F9',
  'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL': '#FFD00E',
  'SCHEDULE_MISC_ERROR': '#3DC3A9',
};

const CATEGORY_ICONS: { [key: string]: StaticImageData } = {
  'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL': contentEmphasisIcon,
  'SCHEDULE_MISC_ERROR': scheduleIcon,
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jdId = params.id as string;

  const [jdDetail, setJdDetail] = useState<JDDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todosByCategory, setTodosByCategory] = useState<{
    [key: string]: TodoItem[];
  }>({});
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  const memoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTogglingAlarm, setIsTogglingAlarm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = tokenManager.getAccessToken();
        const response = await fetch(`/api/jds/${jdId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setJdDetail(data.data);

            // 카테고리별로 투두 그룹화
            const grouped = data.data.toDoLists.reduce(
              (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
                if (!acc[todo.category]) acc[todo.category] = [];
                acc[todo.category].push(todo);
                return acc;
              },
              {}
            );
            setTodosByCategory(grouped);
          }
        }
      } catch (error) {
        console.error('Failed to fetch JD detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jdId]);

  const handleBack = () => {
    router.back();
  };

  const toggleBookmark = async () => {
    if (!jdDetail) return;

    // 즉시 UI 업데이트 (Optimistic update)
    const newBookmarkState = !jdDetail.bookmark;
    setJdDetail({ ...jdDetail, bookmark: newBookmarkState });

    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}/bookmark`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBookmark: newBookmarkState,
        }),
      });

      if (!response.ok) {
        // 실패 시 원래 상태로 복원
        setJdDetail({ ...jdDetail, bookmark: !newBookmarkState });
        console.error('Failed to toggle bookmark');
      } else {
        const responseData = await response.json();
        // 백엔드 응답에서 실제 상태로 업데이트
        if (responseData.data) {
          setJdDetail({ ...jdDetail, bookmark: responseData.data.bookmark });
        }
      }
    } catch (error) {
      // 에러 시 원래 상태로 복원
      setJdDetail({ ...jdDetail, bookmark: !newBookmarkState });
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 86400) {
      return '오늘 수정';
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전 수정`;
    }
  };

  // 디바운스된 메모 저장 함수
  const saveMemo = useCallback(
    async (memoText: string) => {
      try {
        setIsSavingMemo(true);
        const accessToken = tokenManager.getAccessToken();
        const response = await fetch(`/api/jds/${jdId}/memo`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
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

    if (!jdDetail || isTogglingAlarm) return;

    // 알림 상태가 변경되는 경우에만 API 호출
    if (jdDetail.alarmOn !== isEnabled) {
      setIsTogglingAlarm(true);
      setJdDetail({ ...jdDetail, alarmOn: isEnabled });

      try {
        const accessToken = tokenManager.getAccessToken();
        const response = await fetch(`/api/jds/${jdId}/alarm`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isAlarmOn: isEnabled,
          }),
        });

        if (!response.ok) {
          // 실패 시 원래 상태로 복원
          setJdDetail({ ...jdDetail, alarmOn: !isEnabled });
          console.error('Failed to toggle alarm');
        } else {
          const responseData = await response.json();
          // 백엔드 응답에서 실제 상태로 업데이트
          if (responseData.data) {
            setJdDetail({ ...jdDetail, alarmOn: responseData.data.alarmOn });
          }
        }
      } catch (error) {
        // 에러 시 원래 상태로 복원
        setJdDetail({ ...jdDetail, alarmOn: !isEnabled });
        console.error('Error toggling alarm:', error);
      } finally {
        setIsTogglingAlarm(false);
      }
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

  // Todo 완료 상태 토글
  const toggleTodoComplete = async (todo: TodoItem, newStatus: boolean) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(
        `/api/jds/${jdId}/to-do-lists/${todo.checklist_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: todo.category,
            title: todo.title,
            content: todo.content,
            is_done: newStatus,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        // 로컬 상태 업데이트 - 실제 응답 구조에 맞춰서 (응답에서는 done 필드 사용)
        if (jdDetail && responseData.data) {
          const updatedTodos = jdDetail.toDoLists.map((todoItem) =>
            todoItem.checklist_id === todo.checklist_id
              ? {
                  ...todoItem,
                  done:
                    responseData.data.done !== undefined
                      ? responseData.data.done
                      : newStatus,
                }
              : todoItem
          );

          setJdDetail({ ...jdDetail, toDoLists: updatedTodos });

          // 카테고리별 그룹화도 업데이트
          const grouped = updatedTodos.reduce(
            (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
              if (!acc[todo.category]) acc[todo.category] = [];
              acc[todo.category].push(todo);
              return acc;
            },
            {}
          );
          setTodosByCategory(grouped);
        }
      } else {
        const errorData = await response.text();
        console.error(
          'Failed to toggle todo status:',
          response.status,
          errorData
        );
      }
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  // Todo 수정 함수
  const editTodo = async (
    todoId: string,
    data: { category: string; title: string; content: string }
  ) => {
    try {
      // 현재 투두의 완료 상태 찾기
      const currentTodo = jdDetail?.toDoLists.find(
        (todo) => todo.checklist_id.toString() === todoId
      );
      const isDone = currentTodo?.done || false;

      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}/to-do-lists/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          is_done: isDone,
        }),
      });

      if (response.ok) {
        // 데이터 다시 불러오기
        const detailResponse = await fetch(`/api/jds/${jdId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          if (detailData.data) {
            setJdDetail(detailData.data);

            // 카테고리별로 투두 그룹화
            const grouped = detailData.data.toDoLists.reduce(
              (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
                if (!acc[todo.category]) acc[todo.category] = [];
                acc[todo.category].push(todo);
                return acc;
              },
              {}
            );
            setTodosByCategory(grouped);
          }
        }
      } else {
        console.error('Failed to edit todo');
        alert('조각 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error editing todo:', error);
      alert('조각 수정 중 오류가 발생했습니다.');
    }
  };

  // Todo 삭제 함수
  const deleteTodo = async (todoId: string) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}/to-do-lists/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // 데이터 다시 불러오기
        const detailResponse = await fetch(`/api/jds/${jdId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          if (detailData.data) {
            setJdDetail(detailData.data);

            // 카테고리별로 투두 그룹화
            const grouped = detailData.data.toDoLists.reduce(
              (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
                if (!acc[todo.category]) acc[todo.category] = [];
                acc[todo.category].push(todo);
                return acc;
              },
              {}
            );
            setTodosByCategory(grouped);
          }
        }
      } else {
        console.error('Failed to delete todo');
        alert('조각 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('조각 삭제 중 오류가 발생했습니다.');
    }
  };

  // Todo 추가 함수
  const addTodo = async (data: {
    category: string;
    title: string;
    content: string;
  }) => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}/to-do-lists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // 데이터 다시 불러오기
        const detailResponse = await fetch(`/api/jds/${jdId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          if (detailData.data) {
            setJdDetail(detailData.data);

            // 카테고리별로 투두 그룹화
            const grouped = detailData.data.toDoLists.reduce(
              (acc: { [key: string]: TodoItem[] }, todo: TodoItem) => {
                if (!acc[todo.category]) acc[todo.category] = [];
                acc[todo.category].push(todo);
                return acc;
              },
              {}
            );
            setTodosByCategory(grouped);
          }
        }
      } else {
        console.error('Failed to add todo');
        alert('조각 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('조각 추가 중 오류가 발생했습니다.');
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // 삭제 성공 시 대시보드로 이동
        router.push('/dashboard');
      } else {
        console.error('Failed to delete JD');
        alert('채용공고 삭제에 실패했습니다.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting JD:', error);
      alert('채용공고 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  // 지원 완료 핸들러
  const handleApplyComplete = async () => {
    try {
      const accessToken = tokenManager.getAccessToken();
      const response = await fetch(`/api/jds/${jdId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setSnackbar({
          isOpen: true,
          message: '지원 완료로 표시되었습니다.',
          type: 'success',
        });
        // 데이터 다시 불러오기
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error('Failed to mark as applied');
        setSnackbar({
          isOpen: true,
          message: '지원 완료 처리에 실패했습니다.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error marking as applied:', error);
      setSnackbar({
        isOpen: true,
        message: '지원 완료 처리 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
  };

  const calculateCompletionRate = () => {
    if (!jdDetail || !jdDetail.toDoLists || jdDetail.toDoLists.length === 0)
      return { completed: 0, total: 0 };
    const total = jdDetail.toDoLists.length;
    const completed = jdDetail.toDoLists.filter((todo) => todo.done).length;
    return { completed, total };
  };

  const dDayChipColor = (num: number | undefined) => {
    if (jdDetail?.applyAt) {
      return 'dDay-apply';
    }

    if (num === undefined) {
      return 'dDay-anytime';
    }
    if (num < 0) {
      return 'dDay-dayover';
    } else if (num === 0) {
      return 'dDay-day0';
    } else if (num > 0 && num <= 7) {
      return 'dDay-over1';
    } else {
      return 'dDay-default';
    }
  };

  if (isLoading) {
    return (
      <>
        <Header
          backgroundColor='white'
          showLogout={true}
        />
        <main className={styles.main}>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              로딩 중...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!jdDetail) {
    return (
      <>
        <Header
          backgroundColor='white'
          showLogout={true}
        />
        <main className={styles.main}>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              채용공고를 찾을 수 없습니다.
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { completed, total } = calculateCompletionRate();

  return (
    <>
      <Header
        backgroundColor='white'
        showLogout={true}
      />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.leftSection}>
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              <Image
                src={arrowBackIcon}
                alt='뒤로가기'
                width={18.17}
                height={17.69}
              />
            </button>
          </div>

          <div className={styles.rightSection}>
            <button
              className={styles.actionButton}
              onClick={() => {
                if (jdDetail.jdUrl) {
                  window.open(jdDetail.jdUrl, '_blank');
                }
              }}
            >
              <span className={styles.actionButtonText}>채용공고 보기</span>
            </button>

            <button
              className={`${styles.iconButton} ${
                jdDetail.bookmark ? styles.bookmarked : ''
              }`}
              onClick={toggleBookmark}
            >
              <Image
                src={bookmarkIcon}
                alt='북마크'
                width={21.33}
                height={24}
                style={{ opacity: jdDetail.bookmark ? 1 : 0.7 }}
              />
            </button>

            <div
              ref={moreMenuRef}
              style={{ position: 'relative' }}
            >
              <button
                className={styles.iconButton}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                <Image
                  src={moreIcon}
                  alt='더보기'
                  width={21.33}
                  height={5.33}
                />
              </button>

              {/* More menu dropdown */}
              {showMoreMenu && (
                <div className={styles.moreMenu}>
                  <button
                    className={styles.moreMenuItem}
                    onClick={() => {
                      setShowMoreMenu(false);
                      handleApplyComplete();
                    }}
                  >
                    {!jdDetail.applyAt ? '지원 완료' : '지원 완료 취소'}
                  </button>
                  <button
                    className={styles.moreMenuItem}
                    onClick={() => {
                      setShowMoreMenu(false);
                      setIsDeleting(true);
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.container}>
          {/* Header with navigation */}

          {/* Job details */}
          <div className={styles.jobDetails}>
            <div className={styles.jobDetailsTop}>
              <div className={styles.jobDetailsLeft}>
                <DDayChip
                  alarm={jdDetail.alarmOn ? 'on' : 'off'}
                  state='default'
                  className={dDayChipColor(calculateDDay(jdDetail.endedAt))}
                  dDay={calculateDDay(jdDetail.endedAt)}
                />
                <div className={styles.modifiedInfo}>
                  <div className={styles.modifiedText}>
                    {formatTimeAgo(jdDetail.updatedAt)}
                  </div>
                </div>
              </div>
              <div className={styles.jobDetailsRight}>
                <div className={styles.registerInfo}>
                  <div className={styles.registerText}>등록일</div>
                  <div className={styles.separator}>|</div>
                  <div className={styles.registerText}>
                    {formatDate(jdDetail.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.jobDetailsBottom}>
              <div className={styles.jobTitle}>{jdDetail.title}</div>
              <div className={styles.companyName}>{jdDetail.companyName}</div>
            </div>
          </div>

          {/* Progress tracker */}
          <div className={styles.progressTracker}>
            <div className={styles.progressContent}>
              <div className={styles.progressHeader}>
                <div className={styles.progressTitle}>완료한 조각</div>
                <p className={styles.progressCount}>
                  <span className={styles.progressCountActive}>
                    {completed}
                  </span>
                  <span className={styles.progressCountTotal}> / {total}</span>
                </p>
              </div>
              <ProgressBar
                total={total}
                completed={completed}
                className={styles.progressBarInstance}
              />
            </div>
            <button
              className={styles.notificationBtn}
              onClick={handleAlarmButtonClick}
              disabled={isTogglingAlarm}
            >
              <Image
                src={alarmIcon}
                alt='알림'
                width={14.2}
                height={13.1}
              />
              <div className={styles.notificationBtnText}>
                {jdDetail.alarmOn ? '알림 중' : '알림 신청'}
              </div>
            </button>
          </div>

          {/* Jogak Categories */}
          <div className={styles.jogakCategories}>
            {CATEGORIES.map(({ value: category }) => {
              const todos = todosByCategory[category] || [];
              return (
                <JogakCategory
                  key={category}
                  state='active'
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
            placeholder='해당 조각에 대해 메모해보세요.'
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
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onConfirm={handleNotificationConfirm}
        initialEnabled={jdDetail.alarmOn}
      />

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        type={snackbar.type}
      />
    </>
  );
}
