import styles from './Toggle.module.css';

export default function Toggle({
  isOn,
  handleToggle,
}: {
  isOn: boolean;
  handleToggle: () => void;
}) {
  return (
    <button
      className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
      onClick={handleToggle}
    >
      <div
        className={`${styles.toggleThumb} ${isOn ? styles.on : styles.off}`}
      ></div>
    </button>
  );
}
