'use client';

import Image from 'next/image';
import React from 'react';

import loginImage from '@/assets/images/login_modal/background.png';
import closeIcon from '@/assets/images/login_modal/ic_close.svg';
import googleIcon from '@/assets/images/login_modal/ic_google.svg';
import kakaoIcon from '@/assets/images/login_modal/ic_kakao.svg';
import logo from '@/assets/images/logo.svg';

import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com';
    window.location.href = `${apiUrl}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* Desktop Layout */}
        <div className={styles.desktopLayout}>
          <div className={styles.leftSection}>
            <div className={styles.logoSection}>
              <Image src={logo} alt="조각조각" className={styles.logo} />
              <p className={styles.tagline}>
                나의 커리어 조각, 하나씩 완성해요
              </p>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.googleButton}
                onClick={handleGoogleLogin}
              >
                <Image src={googleIcon} alt="Google" width={18} height={18} />
                <span>Google 계정으로 시작하기</span>
              </button>

              <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
                <Image src={kakaoIcon} alt="Kakao" width={18} height={18} />
                <span>카카오톡으로 시작하기</span>
              </button>
            </div>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.closeButtonRight} onClick={onClose}>
              <Image src={closeIcon} alt="닫기" width={21.92} height={21.92} />
            </button>
            <Image
              src={loginImage}
              alt="조각조각 서비스 예시"
              width={384}
              height={500}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              priority
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={styles.mobileLayout}>
          <button className={styles.mobileCloseButton} onClick={onClose}>
            <Image src={closeIcon} alt="닫기" width={21.92} height={21.92} />
          </button>

          <div className={styles.mobileContent}>
            <div className={styles.mobileLogo}>
              <Image src={logo} alt="조각조각" className={styles.logo} />
              <p className={styles.tagline}>
                나의 커리어 조각, 하나씩 완성해요
              </p>
            </div>

            <div className={styles.mobileButtons}>
              <button
                className={styles.googleButton}
                onClick={handleGoogleLogin}
              >
                <Image src={googleIcon} alt="Google" width={18} height={18} />
                <span>Google 계정으로 시작하기</span>
              </button>

              <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
                <Image src={kakaoIcon} alt="Kakao" width={18} height={18} />
                <span>카카오톡으로 시작하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
