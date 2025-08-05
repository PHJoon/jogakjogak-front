"use client";

import React, { useReducer, useState, useRef, useEffect } from "react";
import styles from "./JobList.module.css";
import { ProgressBar } from "./ProgressBar";

interface Props {
  registerDate?: string;
  title?: string;
  company?: string;
  state?: "done" | "hover" | "dayover" | "default";
  className?: string;
  completedCount?: string;
  totalCount?: string | number;
  dDay?: number;
  apply: boolean;
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
  apply,
  onClick,
  onApplyComplete,
  onDelete,
}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp,
    originalState: stateProp,
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
    if (apply) {
      return '지원완료';
    }
    if (dDay === undefined) {
      return "상시채용";
    }else if (dDay >= 0) {
      return `D-${dDay}`;
    }else if (dDay === 0) {
      return "오늘 마감";
    }else {
      return "지원마감";
    }
  }

  const getDDayClassName = () => {
    if (apply) {
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
                      <span className={styles.dDayText}>{dDayCheck()}</span>
                    </div>
                )}
                {["dayover", "done"].includes(state.state) && (
                    <div className={styles.dDayChip2}>
                      {state.state === "done" && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      )}
                      <div className={styles.div2}>
                        {state.state === "done" && <>지원완료</>}
                        {state.state === "dayover" && <>지원마감</>}
                      </div>
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
                        {!apply ? "지원 완료" : "지원 완료 취소"}
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
                    {["default", "hover"].includes(state.state) && <>{completedCount}</>}
                    {state.state === "done" && <>12</>}
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