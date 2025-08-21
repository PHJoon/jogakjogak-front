import styles from './ResumeLoading.module.css';

export default function ResumeLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>이력서를 불러오는 중...</p>
    </div>
  );
}
