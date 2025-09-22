import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import JogakTodoItem from '@/components/jobDetail/JogakTodoItem';
import { TodoItem } from '@/types/jds';

import styles from './JogakTodoList.module.css';

interface Props {
  category: string;
  label: string;
  color: string;
  icon: string | StaticImport;
  plusIcon: string | StaticImport | null;
  todoList: TodoItem[];
}

export default function JogakTodoList({
  category,
  label,
  color,
  icon,
  plusIcon,
  todoList,
}: Props) {
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
          <button className={styles.addTodoItemButton}>
            <Image src={plusIcon} alt="Add Todo" width={20} height={20} />
          </button>
        )}
      </div>

      {todoList.map((todo) => (
        <JogakTodoItem
          key={todo.checklist_id}
          category={category}
          todoItem={todo}
        />
      ))}
    </div>
  );
}
