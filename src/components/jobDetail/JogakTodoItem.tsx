import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import kebabMenuIcon from '@/assets/images/ic_kebab.svg';
import todoCheckboxIcon from '@/assets/images/ic_todo_checkbox.svg';
import todoCheckboxCheckedIcon from '@/assets/images/ic_todo_checkbox_checked.svg';
import todoCompletedIcon from '@/assets/images/ic_todo_completed.svg';
import { TodoItem } from '@/types/jds';

import styles from './JogakTodoItem.module.css';

interface Props {
  category: string;
  todoItem: TodoItem;
}

export default function JogakTodoItem({ category, todoItem }: Props) {
  const moreMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
      key={todoItem.checklist_id}
      className={`${styles.todoItem} ${category === 'COMPLETED_JOGAK' ? styles.completed : ''}`}
    >
      <div className={styles.todoItemHeader}>
        {category === 'COMPLETED_JOGAK' ? (
          <div className={styles.todoCompletedIcon}>
            <Image
              src={todoCompletedIcon}
              alt="Todo checkbox checked"
              width={20}
              height={20}
            />
            <span className={styles.todoCompletedText}>완료</span>
          </div>
        ) : (
          <button className={styles.todoCheckbox}>
            <Image
              src={todoCheckboxIcon}
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
              }}
            >
              수정하기
            </button>
            <button
              className={`${styles.moreMenuItem} ${styles.delete}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <div
        className={`${styles.todoItemContent} ${category === 'COMPLETED_JOGAK' ? styles.completed : ''}`}
      >
        {todoItem.content}
      </div>
    </div>
  );
}
