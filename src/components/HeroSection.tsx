'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { tokenManager } from '@/utils/auth';

import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onLoginClick?: () => void;
}

export default function HeroSection({ onLoginClick }: HeroSectionProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getAccessToken();
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      onLoginClick?.();
    }
  };
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span>막막한 취업 준비, 조각조각이 함께</span>
      </div>
      <h1 className={styles.title}>
        <p>나의 커리어 조각,</p>
        <p>하나씩 완성해요</p>
      </h1>
      <p className={styles.description}>
        AI가 함께하는 나의 취업 성공 투두 리스트
      </p>
      <button className={styles.ctaButton} onClick={handleCtaClick}>
        지금 취업 성공하기
      </button>
    </section>
  );
}
