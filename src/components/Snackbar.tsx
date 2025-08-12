'use client';

import { useEffect, useState } from 'react';

import styles from './Snackbar.module.css';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

export default function Snackbar({
  message,
  isOpen,
  onClose,
  duration = 3000,
  type = 'success',
}: SnackbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`${styles.snackbarContainer} ${isVisible ? styles.visible : ''}`}
    >
      <div className={`${styles.snackbar} ${styles[type]}`}>
        <div className={styles.container}>
          <div className={styles.message}>
            <div className={styles.messageText}>{message}</div>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
