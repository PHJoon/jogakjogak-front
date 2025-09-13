'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import userIcon from '@/assets/images/ic_user.svg';
import logo from '@/assets/images/logo.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useSession from '@/hooks/useSession';
import trackEvent from '@/utils/trackEventGA';

import styles from './Header.module.css';
import SurveyBanner from './SurveyBanner';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState<
    'transparent' | 'white'
  >('white');
  const { isLoggedIn, refetch } = useSession();

  useEffect(() => {
    refetch();
  }, [isLandingPage, refetch]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleMyPageClick = () => {
    trackEvent({
      event: GAEvent.Auth.MY_PAGE,
      event_category: GACategory.AUTH,
    });
    router.push('/mypage');
  };

  // 랜딩페이지에서만 배경 투명하게 초기화
  useEffect(() => {
    if (isLandingPage) {
      setHeaderBackgroundColor('transparent');
    }
  }, [isLandingPage]);

  // 랜딩페이지에서만 헤더 스크롤 시 배경 투명 -> 화이트로 변경
  useEffect(() => {
    if (!isLandingPage) return;

    const scrollHandler = () => {
      if (window.scrollY > 64) {
        setHeaderBackgroundColor('white');
      } else {
        setHeaderBackgroundColor('transparent');
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [isLandingPage]);

  return (
    <>
      <header
        className={`${styles.header} ${
          headerBackgroundColor === 'white' ? styles.whiteBackground : ''
        } ${isLandingPage ? styles.landingPage : ''}`}
      >
        <Link href={isLoggedIn ? '/dashboard' : '/'} className={styles.logo}>
          <Image
            src={logo}
            alt="조각조각 로고"
            width={127.82}
            height={25.11}
            priority
          />
        </Link>
        {isLoggedIn ? (
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
      {!isLandingPage && <SurveyBanner />}
    </>
  );
}
