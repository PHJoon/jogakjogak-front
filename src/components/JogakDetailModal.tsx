'use client';

import React, { useState, useEffect } from 'react';

import styles from './JogakDetailModal.module.css';

interface Props {
  state?: 'active' | 'default' | 'active-memo' | 'add-custom' | 'done';
  text?: string;
  className?: string;
  onClick?: () => void;
  checkboxColor?: string;
  completedAt?: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMemoChange?: (memo: string) => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export function JogakDetailModal({
  state = 'default',
  text = '',
  className = '',
  onClick,
  checkboxColor = '#D9A9F9',
  completedAt,
  description,
  onEdit,
  onDelete,
  onMemoChange,
  onToggleExpand,
  isExpanded: isExpandedProp,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [memo, setMemo] = useState('');

  // props로 받은 isExpanded가 있으면 사용, 없으면 state에 따라 결정
  useEffect(() => {
    if (isExpandedProp !== undefined) {
      setIsExpanded(isExpandedProp);
    } else {
      setIsExpanded(state === 'active' || state === 'active-memo');
    }
  }, [state, isExpandedProp]);

  const handleToggleExpand = () => {
    if (state !== 'add-custom') {
      if (onToggleExpand) {
        onToggleExpand();
      } else {
        setIsExpanded(!isExpanded);
      }
    }
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
    onMemoChange?.(e.target.value);
  };

  if (state === 'add-custom') {
    return (
      <div className={`${styles.jogakDetail} ${className}`}>
        <div
          className={`${styles.doList} ${styles.addCustom}`}
          onClick={onClick}
        >
          <div className={styles.div}>
            <svg
              className={styles.instanceNode}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="11"
                stroke="#DCE5EF"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M12 6V18M6 12H18"
                stroke="#94A2B3"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.textWrapper3}>사용자 지정 추가</div>
          </div>
        </div>
      </div>
    );
  }

  const currentState = isExpanded
    ? state === 'done'
      ? 'active'
      : state === 'default'
        ? 'active'
        : state
    : state;

  return (
    <div className={`${styles.jogakDetail} ${className}`}>
      <div className={`${styles.doList} ${styles[currentState]}`}>
        {['default', 'done'].includes(currentState) && (
          <div className={styles.div}>
            {currentState === 'done' && (
              <>
                <div
                  className={styles.instanceNode}
                  style={{ borderColor: checkboxColor }}
                  onClick={onClick}
                >
                  <div
                    className={styles.checkSquare}
                    style={{ backgroundColor: checkboxColor }}
                  />
                </div>
                <div className={styles.detailTitle}>
                  <div className={styles.frame}>
                    <div className={styles.textWrapper}>{text}</div>
                  </div>
                  {completedAt && <p className={styles.p}>{completedAt}</p>}
                </div>
              </>
            )}

            {currentState === 'default' && (
              <>
                <div className={styles.instanceNode} onClick={onClick}>
                  {/* Empty checkbox */}
                </div>
                <div className={styles.div}>
                  <div className={styles.textWrapper2}>{text}</div>
                </div>
              </>
            )}
          </div>
        )}

        {['active-memo', 'active'].includes(currentState) && (
          <>
            <div className={styles.frame2}>
              <div className={styles.div}>
                <div
                  className={styles.instanceNode}
                  style={state === 'done' ? { borderColor: checkboxColor } : {}}
                  onClick={onClick}
                >
                  {state === 'done' && (
                    <div
                      className={styles.checkSquare}
                      style={{ backgroundColor: checkboxColor }}
                    />
                  )}
                </div>
                <div className={styles.textWrapper4}>{text}</div>
              </div>
              <svg
                className={styles.icon2}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={handleToggleExpand}
              >
                <path
                  d="M7 14L12 9L17 14"
                  stroke="#94A2B3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className={styles.JDMoneedSnapxWrapper}>
              <div className={styles.JDMoneedSnapx}>
                <p className={styles.textWrapper6}>{description}</p>
              </div>
            </div>
          </>
        )}

        {currentState === 'active-memo' && (
          <div className={styles.divWrapper}>
            <input
              type="text"
              className={styles.textWrapper5}
              placeholder="해당 조각에 대해 메모해보세요."
              value={memo}
              onChange={handleMemoChange}
            />
          </div>
        )}

        {['active-memo', 'active'].includes(currentState) && (
          <div className={styles.editDeleteWrapper}>
            <div className={styles.editDelete}>
              <svg
                className={styles.icon3}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                onClick={onEdit}
              >
                <path
                  d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26556C18.1287 3.55152 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.78362 18.0103 5.06958C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
                  stroke="#94A2B3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className={styles.icon3}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                onClick={onDelete}
              >
                <path
                  d="M2.5 5H4.16667H17.5"
                  stroke="#94A2B3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66602 5.00008V3.33341C6.66602 2.89139 6.84161 2.46746 7.15417 2.1549C7.46673 1.84234 7.89066 1.66675 8.33268 1.66675H11.666C12.108 1.66675 12.532 1.84234 12.8445 2.1549C13.1571 2.46746 13.3327 2.89139 13.3327 3.33341V5.00008M15.8327 5.00008V16.6667C15.8327 17.1088 15.6571 17.5327 15.3445 17.8453C15.032 18.1578 14.608 18.3334 14.166 18.3334H5.83268C5.39066 18.3334 4.96673 18.1578 4.65417 17.8453C4.34161 17.5327 4.16602 17.1088 4.16602 16.6667V5.00008H15.8327Z"
                  stroke="#94A2B3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {['default', 'done'].includes(currentState) && (
          <svg
            className={styles.icon2}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={handleToggleExpand}
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="#94A2B3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
