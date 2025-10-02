import Image from 'next/image';
import React from 'react';
import { Controller, useWatch } from 'react-hook-form';

import closeIcon from '@/assets/images/ic_close.svg';
import Button from '@/components/common/Button';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useCreateTodoMutation from '@/hooks/mutations/job_todolist/useCreateTodoMutation';
import useUpdateTodoMutation from '@/hooks/mutations/job_todolist/useUpdateTodoMutation';
import useTodoItemForm from '@/hooks/todoLIst/useTodoItemForm';
import { useBoundStore } from '@/stores/useBoundStore';
import { TodoCategory, TodoItem } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import ErrorMessage from './common/ErrorMessage';
import styles from './TodoModal.module.css';

const CATEGORY_LABEL = {
  STRUCTURAL_COMPLEMENT_PLAN: '필요한 경험과 역량',
  CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL: '내용 강조 및 재구성',
  SCHEDULE_MISC_ERROR: '취업 일정 및 기타',
};

interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
  jdId: number;
}

interface CreateProps extends BaseProps {
  mode: 'create';
  listCategory: TodoCategory;
}

interface EditProps extends BaseProps {
  mode: 'edit';
  todoItem: TodoItem;
}

type Props = CreateProps | EditProps;

export default function TodoModal(props: Props) {
  const { isOpen, onClose, jdId, mode } = props;
  const listCategory = mode === 'create' ? props.listCategory : undefined;
  const todoItem = mode === 'edit' ? props.todoItem : undefined;

  const { handleSubmit, control } = useTodoItemForm({
    initialData:
      mode === 'edit' && todoItem
        ? {
            category: todoItem.category as TodoCategory,
            title: todoItem.title,
            content: todoItem.content,
          }
        : {
            category: listCategory as TodoCategory,
            title: '',
            content: '',
          },
  });

  const categoryWatch = useWatch({ control, name: 'category' });
  const titleWatch = useWatch({ control, name: 'title' });
  const contentWatch = useWatch({ control, name: 'content' });

  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const isFormDirty = () => {
    if (mode === 'edit') {
      return (
        categoryWatch !== (todoItem?.category as TodoCategory) ||
        titleWatch !== todoItem?.title ||
        contentWatch !== todoItem?.content
      );
    }
  };

  const { createTodoMutate, isCreating } = useCreateTodoMutation();
  const { updateTodoMutate, isUpdating } = useUpdateTodoMutation();

  // Todo 추가 함수
  const addTodo = async (data: {
    category: string;
    title: string;
    content: string;
  }) => {
    trackEvent({
      event: GAEvent.TodoList.ADD_TODO,
      event_category: GACategory.TODO,
      jobId: jdId,
    });

    createTodoMutate({
      jdId: jdId,
      newTodoItem: {
        category: data.category,
        title: data.title,
        content: data.content,
      },
    });
  };

  // Todo 수정 함수
  const editTodo = async (data: {
    category: string;
    title: string;
    content: string;
  }) => {
    if (!todoItem) return;
    if (!isFormDirty()) {
      setSnackbar({ type: 'info', message: '변경된 내용이 없습니다.' });
      return;
    }

    trackEvent({
      event: GAEvent.TodoList.EDIT_TODO,
      event_category: GACategory.TODO,
      jobId: jdId,
    });

    updateTodoMutate({
      jdId: jdId,
      todoId: todoItem.checklist_id,
      updateTodoItem: {
        category: data.category,
        title: data.title,
        content: data.content,
        is_done: todoItem.done,
      },
    });
  };

  const onSubmit = async (data: {
    category: TodoCategory;
    title: string;
    content: string;
  }) => {
    if (mode === 'create') {
      await addTodo(data);
    } else {
      await editTodo(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div className={styles.backdrop} />
      {/* Modal content */}
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'create' ? '직접 조각 추가하기' : '조각 수정'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Image src={closeIcon} alt="Close" width={26} height={26} />
          </button>
        </div>
        <form className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label
              className={styles.contentLabel}
              htmlFor="modal-todo-category"
            >
              카테고리
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value || ''}
                  id="modal-todo-category"
                  className={styles.categorySelect}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                      className={styles.categoryOption}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.contentLabel} htmlFor="modal-todo-title">
              제목
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    id="modal-todo-title"
                    placeholder="제목을 입력해주세요."
                    className={styles.titleInput}
                    maxLength={50}
                  />
                  <div className={styles.charCount}>
                    {titleWatch.length} / 50
                  </div>
                  {fieldState.error && (
                    <ErrorMessage message={fieldState.error.message || ''} />
                  )}
                </>
              )}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.contentLabel} htmlFor="modal-todo-content">
              내용
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    {...field}
                    id="modal-todo-content"
                    placeholder="내용을 입력해주세요."
                    className={styles.contentTextarea}
                  />
                  <div className={styles.charCount}>
                    {contentWatch.length}자
                  </div>
                  {fieldState.error && (
                    <ErrorMessage message={fieldState.error.message || ''} />
                  )}
                </>
              )}
            />
          </div>
        </form>
        <div className={styles.modalFooter}>
          <Button
            variant="tertiary"
            onClick={onClose}
            type="button"
            style={{ width: '20%', height: '50px' }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            type="submit"
            style={{ width: '20%', height: '50px' }}
            onClick={handleSubmit(onSubmit)}
            disabled={isCreating || isUpdating}
            isLoading={isCreating || isUpdating}
          >
            {mode === 'create' ? '추가' : '수정'}
          </Button>
        </div>
      </div>
    </>
  );
}
