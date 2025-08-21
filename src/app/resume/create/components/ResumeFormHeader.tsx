import Image from 'next/image';
import { MouseEvent } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import { Button } from '@/components/Button';

import styles from './ResumeFormHeader.module.css';

interface ResumeFormHeaderProps {
  title: string;
  handleBack: () => void;
}

export default function ResumeFormHeader({
  title,
  handleBack,
}: ResumeFormHeaderProps) {
  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={handleBack}>
        <Image
          src={arrowBackIcon}
          alt="뒤로가기"
          width={15.57}
          height={15.16}
        />
      </button>
      <h1 className={styles.title}>{title}</h1>
      <Button variant="disabled" className={styles.pdfButton}>
        PDF로 불러오기
      </Button>
    </div>
  );
}
