'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import closeIcon from '@/assets/notification_modal/ic_close.svg';
import letterIcon from '@/assets/notification_modal/ic_letter.svg';
import { useBoundStore } from '@/stores/useBoundStore';

import { NotificationCancelModal } from './NotificationCancelModal';
import styles from './NotificationModal.module.css';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isEnabled: boolean) => void;
  initialEnabled?: boolean;
}

export default function NotificationModal({
  isOpen,
  onClose,
  onConfirm,
  initialEnabled = false,
}: NotificationModalProps) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isAgreed, setIsAgreed] = useState(initialEnabled); // 알림이 켜져있으면 동의한 것으로 간주
  const [showCancelModal, setShowCancelModal] = useState(false);
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  useEffect(() => {
    setIsEnabled(initialEnabled);
    setIsAgreed(initialEnabled);
  }, [initialEnabled]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(isEnabled);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>내 멈춘 조각 점검</div>
          <button className={styles.closeButton} onClick={onClose}>
            <Image src={closeIcon} alt="닫기" width={17.53} height={17.53} />
          </button>
        </div>

        <div className={styles.contentArea}>
          <p className={styles.description}>
            3일 동안 진행한 조각이 없으면
            <br />
            가입하신 이메일로 알려드려요.
          </p>

          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewTitle}>
                <div className={styles.previewTitleText}>
                  조각조각 알림 도착
                </div>
                <div className={styles.emailIcon}>
                  <Image src={letterIcon} alt="이메일" width={20} height={18} />
                </div>
              </div>
            </div>
            <div className={styles.previewContent}>
              <p className={styles.previewText}>
                조각이 3일 동안 멈춰있어요.
                <br />
                오늘 할 수 있는 것부터 시작해봐요.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.agreementRow}>
          <p className={styles.agreementText}>
            <a
              href="https://zircon-eagle-db5.notion.site/22d02f1ef634808aa79ad41a0f2c3655"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              개인정보 처리 방침
            </a>
            <span className={styles.agreementLabel}> 동의 </span>
            <span className={styles.required}>(필수)</span>
          </p>
          <button
            className={`${styles.checkbox} ${isAgreed ? styles.checked : ''}`}
            onClick={() => {
              // 알림이 켜져있을 때는 체크박스 해제 불가
              if (isEnabled && isAgreed) {
                return;
              }
              setIsAgreed(!isAgreed);
            }}
          >
            {isAgreed && (
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L5 9L2 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleLabel}>알림 받기</div>
          <button
            className={`${styles.toggle} ${isEnabled ? styles.toggleOn : ''}`}
            onClick={() => {
              // 알림을 끄려고 할 때 확인 모달 표시
              if (isEnabled) {
                setShowCancelModal(true);
                return;
              }
              // 토글을 켜려면 개인정보 처리방침에 동의해야 함
              if (!isAgreed) {
                setSnackbar({
                  message: '개인정보 처리 방침에 동의해주세요.',
                  type: 'error',
                });
                return;
              }
              setIsEnabled(true);
            }}
          >
            <div className={styles.toggleThumb} />
          </button>
        </div>

        <button className={styles.confirmButton} onClick={handleConfirm}>
          확인
        </button>
      </div>

      <NotificationCancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setIsEnabled(false);
          setShowCancelModal(false);
        }}
      />
    </div>
  );
}
