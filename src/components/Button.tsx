'use client';

import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || variant === 'disabled';

  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
    >
      <div className={styles.textWrapper}>{children}</div>
    </button>
  );
}
