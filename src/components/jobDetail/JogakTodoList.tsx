import { todo } from 'node:test';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useState } from 'react';

import arrowIcon from '@/assets/images/ic_navigate_next.svg';
import JogakTodoItem from '@/components/jobDetail/JogakTodoItem';
import TodoModal from '@/components/TodoModal';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoItem } from '@/types/jds';

import styles from './JogakTodoList.module.css';
import NoResumeTodoItem from './NoResumeTodoItem';

interface Props {
  category: string;
  label: string;
  color: string;
  icon: string | StaticImport;
  plusIcon: string | StaticImport | null;
  todoList: TodoItem[];
  jdId: number;
}

export default function JogakTodoList({
  category,
  label,
  color,
  icon,
  plusIcon,
  todoList,
  jdId,
}: Props) {
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [showTodoList, setShowTodoList] = useState(true);
  const resume = useBoundStore((state) => state.resume);

  return (
    <div key={category} className={styles.todoList}>
      <div className={styles.todoCategory} style={{ backgroundColor: color }}>
        <Image
          src={icon}
          alt={label}
          width={category === 'COMPLETED_JOGAK' ? 20 : 26}
          height={category === 'COMPLETED_JOGAK' ? 20 : 26}
        />
        <span className={styles.todoCategoryLabel}>{label}</span>
        {category !== 'COMPLETED_JOGAK' && plusIcon && (
          <div className={styles.todoCategoryButtons}>
            <button
              className={styles.addTodoItemButton}
              onClick={() => setShowAddTodoModal(true)}
            >
              <Image src={plusIcon} alt="Add Todo" width={20} height={20} />
            </button>
            <button
              className={styles.showMoreButton}
              onClick={() => setShowTodoList((prev) => !prev)}
            >
              <Image
                src={arrowIcon}
                alt="Add Todo"
                className={`${styles.arrowIcon} ${showTodoList ? styles.up : ''}`}
                width={20}
                height={20}
              />
            </button>
          </div>
        )}
      </div>

      {showTodoList && (
        <>
          {todoList.map((todo) => (
            <JogakTodoItem
              key={todo.checklist_id}
              category={category}
              todoItem={todo}
            />
          ))}

          {category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            resume === null && <NoResumeTodoItem jdId={jdId} />}
        </>
      )}

      {showAddTodoModal && (
        <TodoModal
          isOpen={showAddTodoModal}
          onClose={() => setShowAddTodoModal(false)}
          jdId={jdId}
          mode="create"
        />
      )}
    </div>
  );
}
