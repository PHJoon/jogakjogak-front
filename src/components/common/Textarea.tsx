import type { UseFormRegisterReturn } from 'react-hook-form';

import { useState } from 'react';

import styles from './Textarea.module.css';

type BaseProps = {
  id: string;
  label: string;
  value?: string; // RHF에서는 watch 값 내려줌(표시/스타일용)
  readOnly?: boolean;
  warning?: boolean;
  maxLength?: number;
  style?: React.CSSProperties;
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
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  defaultValue?: never;
  field?: never;
};

type Props = RHFProps | ControlledProps;

export default function Textarea(props: Props) {
  const { id, label, readOnly, warning, maxLength, style, value } = props;

  const isRHFMode = 'field' in props && props.field !== undefined;
  const isControlledMode = 'onChange' in props && props.onChange !== undefined;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={styles.textareaContainer}
      data-readonly={readOnly || undefined}
      data-focused={isFocused || undefined}
      data-warning={warning || undefined}
      data-has-value={Boolean(value?.length) || undefined}
      style={style}
    >
      <label htmlFor={id} className={styles.floatingLabel}>
        {label}
      </label>

      <div className={styles.textareaWrapper}>
        <textarea
          {...(isRHFMode ? props.field : {})}
          {...(isControlledMode
            ? {
                value: props.value,
                onChange: props.onChange,
                name: props.name,
              }
            : {})}
          id={id}
          className={styles.textarea}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          maxLength={maxLength}
        />
      </div>
      {value && !readOnly && (
        <div className={styles.textareaCounter}>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}
