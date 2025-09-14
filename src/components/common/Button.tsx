import Image from 'next/image';
import { ReactNode } from 'react';

import loadingSpinnerIcon from '@/assets/images/ic_loading_spinner.svg';

import styles from './Button.module.css';

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'neutral';
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
}

export default function Button({
  variant = 'primary',
  children,
  style,
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
  isActive = false,
}: Props) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${isActive ? styles.active : ''}`}
      style={style}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Image
          src={loadingSpinnerIcon}
          className={styles.loadingSpinner}
          alt="Loading..."
          width={24}
          height={24}
        />
      ) : (
        children
      )}
    </button>
  );
}
