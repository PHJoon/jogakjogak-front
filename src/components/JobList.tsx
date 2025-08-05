"use client";

import React, { useReducer, useState, useRef, useEffect } from "react";
import styles from "./JobList.module.css";
import { ProgressBar } from "./ProgressBar";
import applyIcon from "../assets/images/color_chip/ic_apply.svg";
import Image from "next/image";

interface Props {
  registerDate?: string;
  title?: string;
  company?: string;
  state?: "done" | "hover" | "dayover" | "default";
  className?: string;
  completedCount?: string;
  totalCount?: string | number;
  dDay?: number;
  isApply?: boolean;
  isAlarmOn?: boolean;
  onClick?: () => void;
  onApplyComplete?: () => void;
  onDelete?: () => void;
}

interface State {
  state: string;
  originalState: string;
}

function reducer(state: State, action: string): State {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        state: "hover",
      };
    case "mouse_leave":
      return {
        ...state,
        state: state.originalState,
      };
  }
  return state;
}

export function JobList({
  registerDate = "2025년 01월 07일",
  title = "2025 상반기 신입 개발자 채용",
  company = "카카오",
  state: stateProp = "default",
  className = "",
  completedCount = "0",
  totalCount = "30",
  dDay = undefined,
  isApply,
  isAlarmOn,
  onClick,
  onApplyComplete,
  onDelete,
}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp,
    originalState: stateProp
  });
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const totalCountNum = typeof totalCount === 'string' ? parseInt(totalCount) : totalCount;
  const completedCountNum = parseInt(completedCount);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const dDayCheck = () => {
    if (isApply) {
      return '지원완료';
    }
    if (dDay === undefined) {
      return "상시채용";
    }else if (dDay > 0) {
      return `D-${dDay}`;
    }else if (dDay === 0) {
      return "오늘 마감";
    }else {
      return "지원마감";
    }
  }


  const getDDayClassName = () => {
    if (isApply) {
      return 'dDay-apply';
    }
    if (dDay === undefined) {
      return 'dDay-anytime';
    } else if (dDay === 0) {
      return 'dDay-0';
    } else if (dDay >= 1 && dDay <= 7) {
      return 'dDay-over1';
    } else if (dDay < 0) {
      return 'dDay-dayover';
    } else {
      return 'dDay-default';
    }
  };

  return (
      <div
          className={`${styles.jobList} ${styles[`state-${state.state}`]} ${className}`}
          onMouseEnter={() => dispatch("mouse_enter")}
          onMouseLeave={() => dispatch("mouse_leave")}
          onClick={onClick}
      >
        <div className={styles.frame}>
          <div className={styles.div}>
            <div className={styles.frame2}>
              <div className={styles.dDayChipWrapper}>
                {["default", "hover"].includes(state.state) && (
                    <div className={`${styles.dDayChip} ${styles[getDDayClassName()]}`}>
                      {isApply && (<Image src={applyIcon} alt="apply" width="12" height="12"/>)}
                      <span className={styles.dDayText}>{dDayCheck()}</span>
                      {isAlarmOn && (<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {getDDayClassName() ==='dDay-default' &&
                            <path d="M7.30039 10.0333L11.0671 6.26665L10.1171 5.31665L7.30039 8.13332L5.88372 6.71665L4.93372 7.66665L7.30039 10.0333ZM8.00039 13.6666C7.16706 13.6666 6.38661 13.5084 5.65906 13.192C4.9315 12.8755 4.29817 12.4478 3.75906 11.9087C3.21995 11.3695 2.79217 10.7362 2.47572 10.0086C2.15928 9.28109 2.00084 8.50043 2.00039 7.66665C1.99995 6.83287 2.15839 6.05243 2.47572 5.32532C2.79306 4.59821 3.22061 3.96487 3.75839 3.42532C4.29617 2.88576 4.9295 2.45798 5.65839 2.14198C6.38728 1.82598 7.16795 1.66754 8.00039 1.66665C8.83284 1.66576 9.6135 1.82421 10.3424 2.14198C11.0713 2.45976 11.7046 2.88754 12.2424 3.42532C12.7802 3.96309 13.2079 4.59643 13.5257 5.32532C13.8435 6.05421 14.0017 6.83465 14.0004 7.66665C13.9991 8.49865 13.8408 9.27932 13.5257 10.0086C13.2106 10.738 12.7828 11.3713 12.2424 11.9087C11.7019 12.446 11.0686 12.8738 10.3424 13.192C9.61617 13.5102 8.8355 13.6684 8.00039 13.6666ZM3.73372 0.56665L4.66706 1.49998L1.83372 4.33332L0.900391 3.39998L3.73372 0.56665ZM12.2671 0.56665L15.1004 3.39998L14.1671 4.33332L11.3337 1.49998L12.2671 0.56665Z" fill="#5D9CFB"/>
                        }
                        {getDDayClassName() !=='dDay-default' &&
                            <path d="M7.30039 10.0333L11.0671 6.26665L10.1171 5.31665L7.30039 8.13332L5.88372 6.71665L4.93372 7.66665L7.30039 10.0333ZM8.00039 13.6666C7.16706 13.6666 6.38661 13.5084 5.65906 13.192C4.9315 12.8755 4.29817 12.4478 3.75906 11.9087C3.21995 11.3695 2.79217 10.7362 2.47572 10.0086C2.15928 9.28109 2.00084 8.50043 2.00039 7.66665C1.99995 6.83287 2.15839 6.05243 2.47572 5.32532C2.79306 4.59821 3.22061 3.96487 3.75839 3.42532C4.29617 2.88576 4.9295 2.45798 5.65839 2.14198C6.38728 1.82598 7.16795 1.66754 8.00039 1.66665C8.83284 1.66576 9.6135 1.82421 10.3424 2.14198C11.0713 2.45976 11.7046 2.88754 12.2424 3.42532C12.7802 3.96309 13.2079 4.59643 13.5257 5.32532C13.8435 6.05421 14.0017 6.83465 14.0004 7.66665C13.9991 8.49865 13.8408 9.27932 13.5257 10.0086C13.2106 10.738 12.7828 11.3713 12.2424 11.9087C11.7019 12.446 11.0686 12.8738 10.3424 13.192C9.61617 13.5102 8.8355 13.6684 8.00039 13.6666ZM3.73372 0.56665L4.66706 1.49998L1.83372 4.33332L0.900391 3.39998L3.73372 0.56665ZM12.2671 0.56665L15.1004 3.39998L14.1671 4.33332L11.3337 1.49998L12.2671 0.56665Z" fill="white"/>
                        }
                          </svg>)}
                    </div>
                )}
              </div>
              <div className={styles.iconWrapper} ref={moreMenuRef}>
                <button
                    className={styles.moreButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreMenu(!showMoreMenu);
                    }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" fill="#94A2B3"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#94A2B3"/>
                    <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="#94A2B3"/>
                  </svg>
                </button>

                {/* More menu dropdown */}
                {showMoreMenu && (
                    <div className={styles.moreMenu}>
                      <button
                          className={styles.moreMenuItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoreMenu(false);
                            onApplyComplete?.();
                          }}
                      >
                        {!isApply ? "지원 완료" : "지원 완료 취소"}
                      </button>
                      <button
                          className={styles.moreMenuItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoreMenu(false);
                            onDelete?.();
                          }}
                      >
                        삭제하기
                      </button>
                    </div>
                )}
              </div>
            </div>
            <div className={styles.frame3}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper2}>{title}</div>
              </div>
              <div className={styles.textWrapper3}>{company}</div>
            </div>
          </div>
          <div className={styles.frame4}>
            <div className={styles.frame2}>
              <div className={styles.textWrapper4}>완료한 조각</div>
              <div className={styles.element2}>
                {state.state === "dayover" && <>13 / 20</>}
                {["default", "done", "hover"].includes(state.state) && (
                    <>
                  <span className={styles.span}>
                    {["default", "hover", "done"].includes(state.state) && <>{completedCount}</>}
                  </span>
                      <span className={styles.spanWrapper}>
                    <span className={styles.textWrapper5}> / {totalCount}</span>
                  </span>
                    </>
                )}
              </div>
            </div>
            {["default", "done", "hover"].includes(state.state) && (
                <ProgressBar
                    total={totalCountNum}
                    completed={completedCountNum}
                    className={styles.progressBarInstance}
                />
            )}
            {state.state === "dayover" && (
                <div className={styles.progressBar2}>
                  {[...Array(13)].map((_, i) => (
                      <div key={i} className={styles.element3} />
                  ))}
                  {[...Array(7)].map((_, i) => (
                      <div key={i + 13} className={styles.elementInactive} />
                  ))}
                </div>
            )}
          </div>
        </div>
        <div className={styles.frame2}>
          <div className={styles.textWrapper6}>등록일</div>
          <div className={styles.registerDate}>{registerDate}</div>
        </div>
      </div>
  );
}