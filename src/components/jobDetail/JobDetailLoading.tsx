import Image from 'next/image';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import moreIcon from '@/assets/images/ic_more.svg';

import styles from './JobDetailLoading.module.css';

export default function JobDetailLoading() {
  return (
    <>
      <main className={styles.main}>
        <div className={`${styles.header} ${styles['skeleton--header']}`}>
          <div className={styles.leftSection}>
            <button className={styles.backButton}>
              <Image
                src={arrowBackIcon}
                alt="뒤로가기"
                width={18.17}
                height={17.69}
              />
            </button>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.actionButton}>
              <span className={styles.actionButtonText}>채용공고 보기</span>
            </button>

            <button className={`${styles.iconButton} ${styles.bookmarked}`}>
              <Image src={bookmarkIcon} alt="북마크" width={24} height={24} />
            </button>

            <div style={{ position: 'relative' }}>
              <button className={styles.iconButton}>
                <Image
                  src={moreIcon}
                  alt="더보기"
                  width={21.33}
                  height={5.33}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={styles['skeleton--container']}>
          <div
            className={`${styles.skeleton} ${styles['skeleton--jobDetails']}`}
          ></div>
          <div
            className={`${styles.skeleton} ${styles['skeleton--progressTracker']}`}
          ></div>
          <div className={`${styles['skeleton--jogakCategories']}`}>
            <div
              className={`${styles.skeleton} ${styles['skeleton--jogakItem']}`}
            ></div>
            <div
              className={`${styles.skeleton} ${styles['skeleton--jogakItem']}`}
            ></div>
            <div
              className={`${styles.skeleton} ${styles['skeleton--jogakItem']}`}
            ></div>
          </div>
          <div
            className={`${styles.skeleton} ${styles['skeleton--memobox']}`}
          ></div>
        </div>
      </main>
    </>
  );
}
