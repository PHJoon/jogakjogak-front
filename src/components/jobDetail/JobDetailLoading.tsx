import Image from 'next/image';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import moreIcon from '@/assets/images/ic_more.svg';

import styles from './JobDetailLoading.module.css';

export default function JobDetailLoading() {
  return (
    <>
      <main className={styles.main}>
        <div className={`${styles.topBarWrapper}`}>
          <div className={`${styles.topBar} skeleton`} />
        </div>

        <div className={`${styles.content}`}>
          <div className={`${styles.jobDetailSummaryBar} skeleton`} />

          <div className={`${styles.todoListSection}`}>
            <div className={`${styles.todoList} skeleton`} />
            <div className={`${styles.todoList} skeleton`} />
            <div className={`${styles.todoList} skeleton`} />
            <div className={`${styles.todoList} skeleton`} />
          </div>
        </div>
      </main>
    </>
  );
}
