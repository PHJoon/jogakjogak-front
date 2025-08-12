'use client';

import React from 'react';

import styles from './NotificationCancelModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function NotificationCancelModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.frame}>
          <p className={styles.bigTitle}>
            <span className={styles.textWrapper}>정말 조각 알림을 </span>
            <span className={styles.span}>취소</span>
            <span className={styles.textWrapper}>하시겠습니까?</span>
          </p>
          <p className={styles.serveTitle}>더이상 이메일을 받을 수 없어요.</p>
        </div>
        <div className={styles.div}>
          <button className={styles.btn} onClick={onClose}>
            <div className={styles.textWrapper2}>취소</div>
          </button>
          <button className={styles.divWrapper} onClick={onConfirm}>
            <div className={styles.textWrapper3}>확인</div>
          </button>
        </div>
      </div>
    </div>
  );
}
