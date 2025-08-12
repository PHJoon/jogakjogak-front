'use client';

import { Fragment } from 'react';

import styles from './DeleteConfirmModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  highlightedText?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = '취소',
  confirmText = '확인',
  highlightedText = '',
}: Props) {
  if (!isOpen) return null;

  const regex = new RegExp(`(${highlightedText})`, 'g');
  const titleWords = title.split(regex);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>
          {titleWords.map((word, idx) => {
            return word === highlightedText ? (
              <span key={idx} style={{ color: 'var(--red-2)' }}>
                {word}
              </span>
            ) : (
              <Fragment key={idx}>{word}</Fragment>
            );
          })}
        </h3>
        <p className={styles.modalMessage}>
          {message.split('\n').map((line, index) => (
            <Fragment key={index}>
              {line}
              {index < message.split('\n').length - 1 && <br />}
            </Fragment>
          ))}
        </p>
        <div className={styles.modalButtons}>
          <button className={styles.modalCancel} onClick={onClose}>
            {cancelText}
          </button>
          <button className={styles.modalConfirm} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
