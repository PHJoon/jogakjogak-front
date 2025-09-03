'use client';

import { useEffect, useState } from 'react';

import { useBoundStore } from '@/stores/useBoundStore';

import styles from './SnackbarStack.module.css';

function Snackbar({
  id,
  message,
  type,
  duration = 3000,
}: {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const removeSnackbar = useBoundStore((state) => state.removeSnackbar);

  useEffect(() => {
    // DOM 붙고 화면 업데이트 준비될 때 실행됨
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => removeSnackbar(id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [isVisible, removeSnackbar, duration, id]);

  return (
    <div
      className={`${styles.snackbar} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}
    >
      <span className={`${styles.message} ${styles[type]}`}>{message}</span>
      <button
        className={styles.dismissButton}
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => removeSnackbar(id), 300);
        }}
      >
        확인
      </button>
    </div>
  );
}

export default function SnackbarStack() {
  const snackbarList = useBoundStore((state) => state.snackbarList);

  return (
    <div className={styles.snackbarStack}>
      {snackbarList.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          id={snackbar.id}
          message={snackbar.message}
          type={snackbar.type}
          duration={snackbar.duration}
        />
      ))}
    </div>
  );
}
