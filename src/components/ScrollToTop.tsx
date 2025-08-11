"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ScrollToTop.module.css";
import scrollToTopIcon from "@/assets/images/ic_scroll_to_top.svg";
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const toggleVisibility = () => {
      // 스크롤이 100px 이상 내려갔을 때 버튼 표시
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    // 초기 확인
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isDashboard) return null;

  return (
    <button
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="맨 위로 가기"
    >
      <Image
        src={scrollToTopIcon}
        alt="맨 위로 가기"
        width={20.22}
        height={20.77}
      />
    </button>
  );
}