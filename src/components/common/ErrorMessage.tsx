import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message }: { message: string }) {
  return <div className={styles.errorMessage}>·&nbsp;{message}</div>;
}
