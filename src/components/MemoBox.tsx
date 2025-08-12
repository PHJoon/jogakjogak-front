'use client';

import React, { useState } from 'react';

import styles from './MemoBox.module.css';

interface Props {
  maxLength?: number;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function MemoBox({
  maxLength = 1000,
  placeholder = '해당 조각에 대해 메모해보세요.',
  className = '',
  initialValue = '',
  onChange,
}: Props) {
  const [text, setText] = useState(initialValue);

  React.useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      onChange?.(newText);
    }
  };

  return (
    <div className={`${styles.memoBox} ${className}`}>
      <textarea
        className={styles.textArea}
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        maxLength={maxLength}
      />
      <div className={styles.countWrapper}>
        <div className={styles.count}>
          {text.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
