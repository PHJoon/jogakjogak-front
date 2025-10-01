import Image from 'next/image';

import emptyJobItemImg from '@/assets/images/empty_job_item.png';
import closeIcon from '@/assets/images/ic_close.svg';

import styles from './NoJobItemModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function NoJobItemModal({
  isOpen,
  onClose,
  onRegisterClick,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.title}>
            <span className={styles.highlight}>채용공고</span>
            <span className={styles.text}>
              를 입력하면 취업을 위해
              <br />
              해야할 일들을 알려드릴게요.
            </span>
          </p>
          <button className={styles.closeButton} onClick={onClose}>
            <Image src={closeIcon} alt="닫기" width={32} height={32} />
          </button>
        </div>
        <div className={styles.contentArea}>
          <Image
            src={emptyJobItemImg}
            alt="이력서 등록"
            height={246}
            width={307}
            className={styles.emptyImage}
          />
        </div>
        <button className={styles.registerButton} onClick={onRegisterClick}>
          채용공고 등록하기
        </button>
      </div>
    </div>
  );
}
