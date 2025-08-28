import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import styles from './JobActionMenu.module.css';

interface Props {
  applyStatus: boolean;
  onClose: () => void;
  onSelect: (action: 'edit' | 'apply' | 'delete') => void;
}

export default function JobActionMenu({
  applyStatus,
  onClose,
  onSelect,
}: Props) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, onClose]);

  return (
    <div className={styles.moreMenu} ref={menuRef}>
      <button
        className={`${styles.moreMenuItem} ${styles.edit}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('edit');
        }}
      >
        공고 수정
      </button>
      <button
        className={`${styles.moreMenuItem} ${styles.apply}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('apply');
        }}
      >
        {applyStatus ? '지원 완료 취소' : '지원 완료'}
      </button>
      <button
        className={`${styles.moreMenuItem} ${styles.delete}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('delete');
        }}
      >
        삭제하기
      </button>
    </div>
  );
}
