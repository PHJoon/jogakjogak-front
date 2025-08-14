'use client';

import Image from 'next/image';

import coffeeCup from '@/assets/images/coffee_cup.png';

import styles from './FeedbackSurveyModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackSurveyModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    window.open(
      'https://docs.google.com/forms/d/1O5kEyMU23rSIMNCrzYxc_8cqZ39wUe4n_QSbBv7xwaI/edit',
      '_blank'
    );
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>별다방 쿠폰 증정</h3>
          <div className={styles.modalImage}>
            <Image src={coffeeCup} alt="coffee-cup" fill />
          </div>
          <p className={styles.modalMessage}>조각조각, 어떠셨나요?</p>
          <p className={styles.modalDescription}>
            짧은 피드백이 서비스 개선에 큰 힘이 됩니다.
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.modalConfirm} onClick={handleConfirm}>
            의견 남기러 가기
          </button>
          <button className={styles.modalCancel} onClick={onClose}>
            다음에
          </button>
        </div>
      </div>
    </div>
  );
}
