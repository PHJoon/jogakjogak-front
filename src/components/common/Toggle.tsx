import styles from './Toggle.module.css';

export default function Toggle({
  isOn,
  onChange,
}: {
  isOn: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`}
      onClick={(e) => {
        e.preventDefault();
        onChange(!isOn);
      }}
      type="button"
    >
      <div
        className={`${styles.toggleThumb} ${isOn ? styles.on : styles.off}`}
      ></div>
    </button>
  );
}
