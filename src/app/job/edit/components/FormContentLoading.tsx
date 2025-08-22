import styles from './FormContentLoading.module.css';

export default function FormContentLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>기존 내용을 불러오는 중...</p>
    </div>
  );
}
