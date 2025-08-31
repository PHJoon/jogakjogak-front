'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import userIcon from '@/assets/images/ic_user.svg';
import logo from '@/assets/images/logo.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
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
  const router = useRouter();
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

  const handleMyPageClick = () => {
    trackEvent({
      event: GAEvent.Auth.MY_PAGE,
      event_category: GACategory.AUTH,
    });
    router.push('/mypage');
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
          <button className={styles.myPageButton} onClick={handleMyPageClick}>
            <Image src={userIcon} alt="마이페이지" width={20} height={20} />
            <span>마이</span>
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
