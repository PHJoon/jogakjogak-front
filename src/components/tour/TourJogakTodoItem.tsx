import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import kebabMenuIcon from '@/assets/images/ic_kebab.svg';
import todoCheckboxIcon from '@/assets/images/ic_todo_checkbox.svg';
import todoCheckboxCheckedIcon from '@/assets/images/ic_todo_checkbox_checked.svg';
import todoCompletedIcon from '@/assets/images/ic_todo_completed.svg';
import ReadMore from '@/components/jobDetail/ReadMore';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoItem } from '@/types/jds';

import styles from './TourJogakTodoItem.module.css';

interface Props {
  category: string;
  todoItem: TodoItem;
}

export default function TourJogakTodoItem({ category, todoItem }: Props) {
  const moreMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [checked, setChecked] = useState(false);
  const {
    setSnackbar,
    dummyCheckedTodoList,
    addDummyCheckedTodo,
    removeDummyCheckedTodo,
    dummyJds,
    dummyJdDetails,
    updateDummyJd,
    updateDummyJdDetail,
    syncDummyJdAndJdDetail,
  } = useBoundStore(
    useShallow((state) => ({
      setSnackbar: state.setSnackbar,
      dummyCheckedTodoList: state.dummyCheckedTodoList,
      addDummyCheckedTodo: state.addDummyCheckedTodo,
      removeDummyCheckedTodo: state.removeDummyCheckedTodo,
      dummyJdDetails: state.dummyJdDetails,
      dummyJds: state.dummyJds,
      updateDummyJd: state.updateDummyJd,
      updateDummyJdDetail: state.updateDummyJdDetail,
      syncDummyJdAndJdDetail: state.syncDummyJdAndJdDetail,
    }))
  );

  // Todo 여러개 완료 체크
  const handleClickCheckbox = (prev: boolean) => {
    if (prev) {
      removeDummyCheckedTodo(todoItem.checklist_id);
      return;
    }
    addDummyCheckedTodo(todoItem.checklist_id);
  };

  // Todo 완료 항목 완료상태 해제
  const toggleUncompleteTodo = async () => {
    if (!todoItem.jdId) return;
    syncDummyJdAndJdDetail(todoItem.jdId, {
      completedPieces: dummyJds[todoItem.jdId].completedPieces - 1,
    });
    updateDummyJdDetail(todoItem.jdId, {
      toDoLists: dummyJdDetails[todoItem.jdId].toDoLists.map((todo) =>
        todo.checklist_id === todoItem.checklist_id
          ? { ...todo, done: false }
          : todo
      ),
    });

    setSnackbar({
      message: '조각 완료 상태가 해제되었습니다.',
      type: 'success',
    });
  };

  useEffect(() => {
    if (dummyCheckedTodoList.includes(todoItem.checklist_id)) {
      setChecked(true);
      return;
    }
    setChecked(false);
  }, [dummyCheckedTodoList, todoItem.checklist_id]);

  // 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node) &&
        moreMenuButtonRef.current &&
        !moreMenuButtonRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreMenuRef, moreMenuButtonRef]);

  return (
    <div
      className={`${styles.todoItem} ${category === 'COMPLETED_JOGAK' ? styles.completed : ''}`}
    >
      <div className={styles.todoItemHeader}>
        {category === 'COMPLETED_JOGAK' ? (
          <button
            className={styles.todoCompletedBadge}
            onClick={toggleUncompleteTodo}
          >
            <Image
              src={todoCompletedIcon}
              alt="Todo checkbox checked"
              width={20}
              height={20}
            />
            <span className={styles.todoCompletedText}>완료</span>
          </button>
        ) : (
          <button
            className={styles.todoCheckbox}
            onClick={() => handleClickCheckbox(checked)}
          >
            <Image
              src={checked ? todoCheckboxCheckedIcon : todoCheckboxIcon}
              alt="Todo checkbox"
              width={24}
              height={24}
            />
          </button>
        )}
        <span
          className={`${styles.todoItemTitle} ${category === 'COMPLETED_JOGAK' ? styles.completed : ''}`}
        >
          {todoItem.title}
        </span>
        <button
          className={styles.todoItemMenuButton}
          ref={moreMenuButtonRef}
          onClick={(e) => {
            setShowMoreMenu((prev) => !prev);
            e.stopPropagation();
          }}
        >
          <Image
            src={kebabMenuIcon}
            alt="Todo item more menu"
            width={24}
            height={24}
          />
        </button>
        {showMoreMenu && (
          <div className={styles.moreMenu} ref={moreMenuRef}>
            <button
              className={`${styles.moreMenuItem} ${styles.edit}`}
              onClick={(e) => {
                e.stopPropagation();
                setSnackbar({
                  message: '둘러보기에서는 수정 기능을 사용할 수 없습니다.',
                  type: 'info',
                });
              }}
            >
              수정하기
            </button>
            <button
              className={`${styles.moreMenuItem} ${styles.delete}`}
              onClick={(e) => {
                e.stopPropagation();
                setSnackbar({
                  message: '둘러보기에서는 삭제 기능을 사용할 수 없습니다.',
                  type: 'info',
                });
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <ReadMore lines={6} content={todoItem.content} />
    </div>
  );
}
