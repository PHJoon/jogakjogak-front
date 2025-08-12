'use client';

import Image from 'next/image';
import { useState } from 'react';

import emptyResumeImg from '@/assets/images/empty-resume.png';

import styles from './NoResumeModal.module.css';

interface NoResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function NoResumeModal({
  isOpen,
  onClose,
  onRegisterClick,
}: NoResumeModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.title}>
            <span className={styles.highlight}>이력서</span>
            <span className={styles.text}>와 </span>
            <span className={styles.highlight}>채용공고</span>
            <span className={styles.text}>
              를 입력하면
              <br />
              할일을 알려드릴게요.
            </span>
          </p>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 8L8 24M8 8L24 24"
                stroke="#4F5E6F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.contentArea}>
          <Image
            src={emptyResumeImg}
            alt="이력서 등록"
            width={246}
            height={246}
            className={styles.emptyImage}
          />
        </div>
        <button className={styles.registerButton} onClick={onRegisterClick}>
          이력서 등록하기
        </button>
      </div>
    </div>
  );
}
