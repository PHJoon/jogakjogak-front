'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import logoutIcon from '@/assets/images/ic_logout.svg';
import logo from '@/assets/images/logo.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { logout } from '@/lib/api/auth/authApi';
import trackEvent from '@/utils/trackEventGA';

import styles from './Header.module.css';
import LoginModal from './LoginModal';
import SurveyBanner from './SurveyBanner';

interface HeaderProps {
  backgroundColor?: 'transparent' | 'white';
  showLogout?: boolean;
  landingPage?: boolean;
}

export default function Header({
  backgroundColor = 'transparent',
  showLogout = false,
  landingPage = false,
}: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState<
    'transparent' | 'white'
  >(backgroundColor);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogoutClick = () => {
    trackEvent({
      event: GAEvent.Auth.LOGOUT,
      event_category: GACategory.AUTH,
    });
    // 즉시 UI 업데이트를 위해 홈으로 이동
    window.location.href = '/';

    // 백그라운드에서 로그아웃 처리
    logout().catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  useEffect(() => {
    if (!landingPage) return;

    const scrollHandler = () => {
      if (window.scrollY > 64) {
        setHeaderBackgroundColor('white');
      } else {
        setHeaderBackgroundColor('transparent');
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [landingPage]);

  return (
    <>
      <header
        className={`${styles.header} ${
          headerBackgroundColor === 'white' ? styles.whiteBackground : ''
        } ${landingPage ? styles.landingPage : ''}`}
      >
        <Link href={showLogout ? '/dashboard' : '/'} className={styles.logo}>
          <Image
            src={logo}
            alt="조각조각 로고"
            width={127.82}
            height={25.11}
            priority
          />
        </Link>
        {showLogout ? (
          <button className={styles.logoutButton} onClick={handleLogoutClick}>
            <Image src={logoutIcon} alt="로그아웃" width={17.6} height={18} />
          </button>
        ) : (
          <button className={styles.loginButton} onClick={handleLoginClick}>
            <span>로그인</span>
          </button>
        )}
      </header>

      {/* 설문조사 배너 */}
      {!landingPage && <SurveyBanner />}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </>
  );
}
