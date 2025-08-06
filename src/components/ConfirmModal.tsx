'use client';

import React from 'react';
import styles from './ConfirmModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '확인',
  message = '',
  confirmText = '확인',
  cancelText = '취소',
}: Props) {
  if (!isOpen) return null;


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>
          {message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < message.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <div className={styles.modalButtons}>
          <button
            className={styles.modalCancel}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={styles.modalConfirm}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
