import { todo } from 'node:test';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import kebabMenuIcon from '@/assets/images/ic_kebab.svg';
import lockIcon from '@/assets/images/ic_lock.svg';
import arrowIcon from '@/assets/images/ic_navigate_next.svg';
import todoCheckboxIcon from '@/assets/images/ic_todo_checkbox.svg';
import Button from '@/components/common/Button';
import JogakTodoEmptyItem from '@/components/jobDetail/JogakTodoEmptyItem';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoCategory, TodoItem } from '@/types/jds';

import TourJogakTodoItem from './TourJogakTodoItem';
import styles from './TourJogakTodoList.module.css';

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

export default function TourJogakTodoList({
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
  const [showTodoList, setShowTodoList] = useState(true);
  const resume = useBoundStore((state) => state.resume);
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const hasItems = (category: TodoCategory) => {
    return (
      originalTodoList?.some((item) => item.category === category) ?? false
    );
  };

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
              onClick={() =>
                setSnackbar({
                  message: '둘러보기에서는 조각 추가가 불가능합니다.',
                  type: 'info',
                })
              }
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
              <TourJogakTodoItem
                key={todo.checklist_id}
                category={category}
                todoItem={todo}
              />
            ))}

          {/* 이력서 없을 때 내용 강조 및 재구성 아이템 */}
          {todoList.length === 0 &&
            category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            resume === null && (
              <div className={`${styles.todoItem}`}>
                <div className={styles.todoItemHeader}>
                  <button className={styles.todoCheckbox}>
                    <Image
                      src={todoCheckboxIcon}
                      alt="Todo checkbox"
                      width={24}
                      height={24}
                    />
                  </button>
                  <span className={`${styles.todoItemTitle}`}>
                    이력서가 있어야 확인할 수 있어요.
                  </span>
                  <button className={styles.todoItemMenuButton}>
                    <Image
                      src={kebabMenuIcon}
                      alt="Todo item more menu"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
                <p className={`${styles.todoItemContent}`}>
                  이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수
                  있습니다. 이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성
                  페이지로 이동합니다. 이력서를 등록한 후, 지원한 기업의 채용
                  공고에서 확인할 수 있습니다. 이력서로 잠금해제 버튼을
                  눌러주세요! 이력서 작성 페이지로 이동합니다. 이력서를 등록한
                  후, 지원한 기업의 채용 공고에서 확인할 수 있습니다. 이력서로
                  잠금해제 버튼을 눌러주세요! 이력서 작성 페이지로 이동합니다.
                  이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수
                  있습니다. 이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성
                  페이지로 이동합니다.
                </p>

                <div className={styles.todoLocked}>
                  <div className={styles.lockedTitle}>
                    <Image
                      src={lockIcon}
                      alt="Lock icon"
                      width={24}
                      height={24}
                    />
                    이력서가 있어야 확인할 수 있어요.
                  </div>
                  <p className={styles.lockedDescription}>
                    가장 부족한 부분을 이력서로 분석해드려요.
                  </p>
                  <Button
                    style={{ width: '100%', height: '48px' }}
                    onClick={() => {
                      router.push('/tour/resume/create');
                    }}
                  >
                    이력서로 잠금해제
                  </Button>
                </div>
              </div>
            )}

          {/* 이력서가 존재하지만 내용 강조 및 재구성 카테고리가 하나도 없을 때 */}
          {todoList.length === 0 &&
            category === 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL' &&
            !hasItems(category as TodoCategory) &&
            !!resume && (
              <JogakTodoEmptyItem
                title={'이력서 내용이 부족해서 표시할 내용이 없어요.'}
                buttonLabel={'이력서 수정하러 가기'}
                onClick={() => {
                  setSnackbar({
                    message: '둘러보기에서는 이력서 수정이 불가능합니다.',
                    type: 'info',
                  });
                }}
              />
            )}

          {/* 다른 카테고리에서 모든 항목이 완료되었을 때 (완료 카테고리 제외) */}
          {todoList.length === 0 &&
            category !== 'COMPLETED_JOGAK' &&
            hasItems(category as TodoCategory) &&
            allItemsDone(category as TodoCategory) && (
              <JogakTodoEmptyItem
                title={'모든 조각을 완료했어요 ! 🎉'}
                buttonLabel="다른 채용공고 분석하기"
                onClick={() => router.push('/tour/dashboard')}
              />
            )}
        </>
      )}
    </div>
  );
}
