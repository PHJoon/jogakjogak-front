import Image from 'next/image';
import React from 'react';

import coffeeCupImg from '@/assets/images/coffee_cup.png';
import closeIcon from '@/assets/images/ic_close_white.svg';
import copyIcon from '@/assets/images/ic_copy.svg';
import facebookIcon from '@/assets/images/ic_facebook.svg';
import instagramIcon from '@/assets/images/ic_instagram.svg';
import nextIcon from '@/assets/images/ic_navigate_next.svg';
import warningIcon from '@/assets/images/ic_warning.svg';
import jogakEventTitle from '@/assets/images/jogak_event_title.svg';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './FirstCompleteEventModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eventCode: string;
}

export default function FirstCompleteEventModal({
  isOpen,
  onClose,
  eventCode,
}: Props) {
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const handleClickCopy = () => {
    navigator.clipboard.writeText(eventCode).then(() => {
      setSnackbar({ message: '이벤트 코드가 복사되었어요.', type: 'success' });
    });
  };

  const handleClickInstagram = () => {
    window.open(
      'https://www.instagram.com/p/DPPHezIk1F9/?utm_source=ig_web_copy_link&igsh=enA0ZWUydXhhb2x4',
      '__blank'
    );
  };

  const handleClickFacebook = () => {
    window.open('https://www.facebook.com/share/p/1BB3tcTGXE/', '__blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div
        className={styles.backdrop}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      {/* Modal content */}
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Image
              src={jogakEventTitle}
              alt="조각 이벤트"
              width={179}
              height={21}
            />
          </h2>
        </div>
        <div className={styles.modalContent}>
          <Image
            src={coffeeCupImg}
            alt="Coffee Cup"
            width={124}
            height={124}
            className={styles.coffeeCupImg}
          />
          <h3 className={styles.subTitle}>
            SNS에 아래 <span>이벤트 코드</span>를 남기면 추첨을 통해 커피 쿠폰을
            드려요.
          </h3>

          <div className={styles.codeContainer}>
            <span className={styles.codeLabel}>이벤트 코드</span>
            <span className={styles.codeText}>{eventCode}</span>
            <button className={styles.copyButton} onClick={handleClickCopy}>
              <Image src={copyIcon} alt="Copy Icon" width={20} height={20} />
            </button>
          </div>

          <div className={styles.socialContainer}>
            <div className={styles.socialWrapper}>
              <div className={styles.socialItem}>
                <Image
                  src={instagramIcon}
                  alt="Instagram"
                  width={18}
                  height={18}
                />
                인스타그램
              </div>
              <button
                className={styles.socialButton}
                onClick={handleClickInstagram}
              >
                댓글로 참여
                <Image src={nextIcon} alt="Next" width={20} height={20} />
              </button>
            </div>
            <div className={styles.socialWrapper}>
              <div className={styles.socialItem}>
                <Image
                  src={facebookIcon}
                  alt="Facebook"
                  width={18}
                  height={18}
                />
                페이스북
              </div>
              <button
                className={styles.socialButton}
                onClick={handleClickFacebook}
              >
                댓글로 참여
                <Image src={nextIcon} alt="Next" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.warningContainer}>
          <Image src={warningIcon} alt="Warning" width={20} height={20} />
          <p className={styles.warningText}>위 이벤트는 한 번만 보여드려요.</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <span>닫기</span>
          <Image src={closeIcon} alt="Close" width={24} height={24} />
        </button>
      </div>
    </>
  );
}
