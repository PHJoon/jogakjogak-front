import type { UseFormRegisterReturn } from 'react-hook-form';

import { InputHTMLAttributes, useState } from 'react';

import styles from './Input.module.css';

type BaseProps = {
  id: string;
  label: string;
  value?: string; // RHF에서는 watch 값 내려줌(표시/스타일용)
  readOnly?: boolean;
  warning?: boolean;
  maxLength?: number;
  style?: React.CSSProperties;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  disabled?: boolean;
  required?: boolean;
};

// RHF 모드
type RHFProps = BaseProps & {
  field: UseFormRegisterReturn<string>;
  // 제어 props는 금지
  defaultValue?: never;
  onChange?: never;
  name?: never;
};

// 제어(Controlled) 모드
type ControlledProps = BaseProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  defaultValue?: never;
  field?: never;
};

type Props = RHFProps | ControlledProps;

export default function Input(props: Props) {
  const {
    id,
    label,
    readOnly,
    warning,
    maxLength,
    style,
    value,
    type = 'text',
    disabled,
    required,
  } = props;

  const isRHFMode = 'field' in props && props.field !== undefined;
  const isControlledMode = 'onChange' in props && props.onChange !== undefined;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={styles.inputContainer}
      data-readonly={readOnly || undefined}
      data-focused={isFocused || undefined}
      data-warning={warning || undefined}
      data-has-value={Boolean(value?.length) || undefined}
      style={style}
    >
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          {...(isRHFMode ? props.field : {})}
          {...(isControlledMode
            ? { value: props.value, onChange: props.onChange, name: props.name }
            : {})}
          id={id}
          className={styles.input}
          type={type}
          maxLength={maxLength}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          readOnly={readOnly}
          required={required}
          disabled={disabled}
        />

        {value && !readOnly && !disabled && maxLength && (
          <div className={styles.inputCounter}>
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
