'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import introImage from '@/assets/images/intro.png';
import googleIcon from '@/assets/images/login_modal/ic_google.svg';
import kakaoIcon from '@/assets/images/login_modal/ic_kakao.svg';
import logo from '@/assets/images/logo.svg';
import Button from '@/components/common/Button';
import Header from '@/components/Header';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { useBoundStore } from '@/stores/useBoundStore';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const apiUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_TEST_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleClickLogin = () => {
    setSnackbar({
      type: 'info',
      message: '조각조각의 로그인 서비스가 종료되었어요 🥲',
    });
    setTimeout(() => {
      setSnackbar({
        type: 'success',
        message: '조각조각 둘러보기 버튼을 통해 자유롭게 둘러보실 수 있어요.',
      });
    }, 1000);
  };

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

  const handleClickGuestLogin = () => {
    router.push('/tour/dashboard');
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
              onClick={handleClickLogin}
            >
              <Image src={googleIcon} alt="Google" width={18} height={18} />
              <span>Google 계정으로 시작하기</span>
            </button>

            <button
              className={`${styles.loginButton} ${styles.kakaoButton}`}
              onClick={handleClickLogin}
            >
              <Image src={kakaoIcon} alt="Kakao" width={18} height={18} />
              <span>카카오톡으로 시작하기</span>
            </button>

            <Button
              variant="neutral"
              style={{ width: '100%', height: '48px' }}
              onClick={handleClickGuestLogin}
            >
              조각조각 둘러보기
            </Button>
          </div>
        </section>

        <aside className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={introImage}
              alt="Intro image"
              priority
              fill
              style={{ objectFit: 'cover', objectPosition: 'left' }}
            />
          </div>
        </aside>
      </main>
    </>
  );
}
