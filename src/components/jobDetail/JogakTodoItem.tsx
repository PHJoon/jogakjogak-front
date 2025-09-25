import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import kebabMenuIcon from '@/assets/images/ic_kebab.svg';
import todoCheckboxIcon from '@/assets/images/ic_todo_checkbox.svg';
import todoCheckboxCheckedIcon from '@/assets/images/ic_todo_checkbox_checked.svg';
import todoCompletedIcon from '@/assets/images/ic_todo_completed.svg';
import TodoModal from '@/components/TodoModal';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useDeleteTodoMutation from '@/hooks/mutations/job_todolist/useDeleteTodoMutation';
import useToggleCompleteTodoMutation from '@/hooks/mutations/job_todolist/useToggleCompleteTodoMutation';
import useUpdateTodoMutation from '@/hooks/mutations/job_todolist/useUpdateTodoMutation';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoCategory, TodoItem } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import styles from './JogakTodoItem.module.css';
import ReadMore from './ReadMore';

interface Props {
  category: string;
  todoItem: TodoItem;
}

export default function JogakTodoItem({ category, todoItem }: Props) {
  const moreMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUpdateTodoModal, setShowUpdateTodoModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const { checkedTodoList, addCheckedTodo, removeCheckedTodo } = useBoundStore(
    useShallow((state) => ({
      checkedTodoList: state.checkedTodoList,
      addCheckedTodo: state.addCheckedTodo,
      removeCheckedTodo: state.removeCheckedTodo,
    }))
  );

  const { deleteTodoMutate } = useDeleteTodoMutation();
  const { toggleCompleteTodoMutate } = useToggleCompleteTodoMutation();

  const contentRef = useRef<HTMLDivElement | null>(null);

  // Todo 여러개 완료 체크
  const handleClickCheckbox = (prev: boolean) => {
    if (prev) {
      removeCheckedTodo(todoItem.checklist_id);
      return;
    }
    addCheckedTodo(todoItem.checklist_id);
  };

  // Todo 완료 항목 완료상태 해제
  const toggleUncompleteTodo = async () => {
    if (!todoItem.jdId) return;

    toggleCompleteTodoMutate({
      jdId: todoItem.jdId,
      todoId: todoItem.checklist_id,
      updatedDoneState: false,
    });
  };

  // Todo 삭제 함수
  const deleteTodo = async () => {
    if (!todoItem.jdId) return;

    trackEvent({
      event: GAEvent.TodoList.DELETE_TODO,
      event_category: GACategory.TODO,
      jobId: todoItem.jdId,
    });

    deleteTodoMutate({
      jdId: todoItem.jdId,
      todoId: todoItem.checklist_id,
    });
  };

  useEffect(() => {
    if (checkedTodoList.includes(todoItem.checklist_id)) {
      setChecked(true);
      return;
    }
    setChecked(false);
  }, [checkedTodoList, todoItem.checklist_id]);

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
                setShowUpdateTodoModal(true);
              }}
            >
              수정하기
            </button>
            <button
              className={`${styles.moreMenuItem} ${styles.delete}`}
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo();
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <ReadMore lines={4} content={todoItem.content} />
      {showUpdateTodoModal && (
        <TodoModal
          isOpen={showUpdateTodoModal}
          onClose={() => setShowUpdateTodoModal(false)}
          mode="edit"
          todoItem={todoItem}
        />
      )}
    </div>
  );
}
