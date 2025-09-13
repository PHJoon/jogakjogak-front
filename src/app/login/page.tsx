'use client';

import Image from 'next/image';

import introImage from '@/assets/images/intro.png';
import googleIcon from '@/assets/images/login_modal/ic_google.svg';
import kakaoIcon from '@/assets/images/login_modal/ic_kakao.svg';
import logo from '@/assets/images/logo.svg';
import Header from '@/components/Header';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

export default function LoginPage() {
  const apiUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_TEST_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleKakaoLogin = () => {
    trackEvent({
      event: GAEvent.Auth.LOGIN,
      event_category: GACategory.AUTH,
      login_method: 'kakao',
    });
    window.location.href = `${apiUrl}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    trackEvent({
      event: GAEvent.Auth.LOGIN,
      event_category: GACategory.AUTH,
      login_method: 'google',
    });
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.loginSection}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logoWrapper}>
              <Image
                src={logo}
                alt="조각조각"
                className={styles.logo}
                width={239.46}
                height={46.71}
              />
            </h1>
            <p className={styles.tagline}>나의 커리어 조각, 하나씩 완성해요</p>
          </div>

          <div className={styles.loginButtonContainer}>
            <button
              className={`${styles.loginButton} ${styles.googleButton}`}
              onClick={handleGoogleLogin}
            >
              <Image src={googleIcon} alt="Google" width={18} height={18} />
              <span>Google 계정으로 시작하기</span>
            </button>

            <button
              className={`${styles.loginButton} ${styles.kakaoButton}`}
              onClick={handleKakaoLogin}
            >
              <Image src={kakaoIcon} alt="Kakao" width={18} height={18} />
              <span>카카오톡으로 시작하기</span>
            </button>
          </div>
        </section>
        <aside className={styles.imageSection}>
          <Image src={introImage} alt="Intro image" fill priority />
        </aside>
      </main>
    </>
  );
}
