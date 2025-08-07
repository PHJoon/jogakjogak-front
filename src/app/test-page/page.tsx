import Header from '@/components/Header';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import { JobAdd } from '@/components/JobAdd';

export default function TestPage() {
  return (
    <>
      <Header
        backgroundColor='white'
        showLogout={true}
      />
      <main className={styles.main}>
        <div className={styles.containerLoading}>
          <div className={`${styles.skeleton} ${styles.resumeLoading}`} />
          <div className={`${styles.skeleton} ${styles.sortContainerLoading}`} />
          <div className={styles.jobSectionLoading}>
            <JobAdd />
            <div className={`${styles.skeleton} ${styles.jobLoading}`}/>
            <div className={`${styles.skeleton} ${styles.jobLoading}`}/>
            <div className={`${styles.skeleton} ${styles.jobLoading}`}/>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
