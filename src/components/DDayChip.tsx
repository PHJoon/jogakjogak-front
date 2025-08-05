import React from "react";
import styles from "./DDayChip.module.css";

interface Props {
  alarm?: "on" | "off";
  state?: "default" | "alarm";
  className?: string;
  dDay?: number;
}

export function DDayChip({ 
  state = "default", 
  className = "",
  dDay = 52 
}: Props) {
  switch (className) {
    case "dayover":
      return (
          <div className={`${styles.chip} ${styles[state]} ${className}`}>
            <span className={styles.text}>지원마감</span>
          </div>
      );
    case "day0":
      return (
          <div className={`${styles.chip} ${styles[state]} ${className}`}>
            <span className={styles.text}>오늘 마감</span>
          </div>
      );
    case "anytime":
      return (
          <div className={`${styles.chip} ${styles[state]} ${className}`}>
            <span className={styles.text}>상시채용</span>
          </div>
      );
    default:
      return (
          <div className={`${styles.chip} ${styles[state]} ${className}`}>
            <span className={styles.text}>D-{dDay}</span>
          </div>
      );
  }



}