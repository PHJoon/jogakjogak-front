import type { UseFormRegisterReturn } from 'react-hook-form';

import { useState } from 'react';

import styles from './Input.module.css';

interface Props {
  id: string;
  label: string;
  value?: string;
  readOnly?: boolean;
  warning?: boolean;
  maxLength?: number;
  field?: UseFormRegisterReturn<string>;
  style?: React.CSSProperties;
}

export default function Input({
  id,
  label,
  value,
  readOnly = false,
  warning = false,
  maxLength = 30,
  field,
  style,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={styles.inputContainer}
      data-readonly={readOnly || undefined}
      data-focused={isFocused || undefined}
      data-warning={warning || undefined}
      data-has-value={!!value || undefined}
      style={style}
    >
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          {...field}
          id={id}
          className={styles.input}
          type="text"
          value={value}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          readOnly={readOnly}
        />

        {value && !readOnly && (
          <div className={styles.inputCounter}>
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
