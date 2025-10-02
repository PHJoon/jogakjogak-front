import { todo } from 'node:test';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import arrowIcon from '@/assets/images/ic_navigate_next.svg';
import JogakTodoItem from '@/components/jobDetail/JogakTodoItem';
import TodoModal from '@/components/TodoModal';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoCategory, TodoItem } from '@/types/jds';

import JogakTodoEmptyItem from './JogakTodoEmptyItem';
import styles from './JogakTodoList.module.css';
import NoResumeTodoItem from './NoResumeTodoItem';

interface Props {
  category: string;
  label: string;
  color: string;
  icon: string | StaticImport;
  plusIcon: string | StaticImport | null;
  todoList: TodoItem[];
  originalTodoList: TodoItem[];
  jdId: number;
}

export default function JogakTodoList({
  category,
  label,
  color,
  icon,
  plusIcon,
  todoList,
  originalTodoList,
  jdId,
}: Props) {
  const router = useRouter();
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [showTodoList, setShowTodoList] = useState(true);
  const resume = useBoundStore((state) => state.resume);

  // CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL 카테고리에 할 일 항목이 하나도 없을 때
  const hasNoCERP = originalTodoList?.some(
    (item) => item.category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL'
  );

  const allItemsDone = (category: TodoCategory) => {
    return (
      originalTodoList
        ?.filter((item) => item.category === category)
        .every((item) => item.done) ?? false
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 745) {
        setShowTodoList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          {todoList.length > 0 &&
            todoList.map((todo) => (
              <JogakTodoItem
                key={todo.checklist_id}
                category={category}
                todoItem={todo}
              />
            ))}

          {/* 이력서 없을 때 내용 강조 및 재구성 아이템 */}
          {todoList.length === 0 &&
            category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            resume === null && <NoResumeTodoItem jdId={jdId} />}

          {/* 이력서가 존재하지만 내용 강조 및 재구성 카테고리가 하나도 없을 때 */}
          {todoList.length === 0 &&
            category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            !!resume && (
              <JogakTodoEmptyItem
                title={'이력서 내용이 부족해서 표시할 내용이 없어요.'}
                buttonLabel={'이력서 수정하러 가기'}
                onClick={() => router.push('/resume/update')}
              />
            )}

          {/* 다른 카테고리에서 모든 항목이 완료되었을 때 (완료 카테고리 제외) */}
          {todoList.length === 0 &&
            category !== 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            category !== 'COMPLETED_JOGAK' &&
            allItemsDone(category as TodoCategory) && (
              <JogakTodoEmptyItem
                title={'모든 조각을 완료했어요 ! 🎉'}
                buttonLabel="다른 채용공고 분석하기"
                onClick={() => router.push('/dashboard')}
              />
            )}
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
