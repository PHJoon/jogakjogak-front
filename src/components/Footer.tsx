'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import emailIcon from '@/assets/images/ico_email.svg';
import logo from '@/assets/images/logo.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { tokenManager } from '@/lib/auth/tokenManager';
import trackEvent from '@/utils/trackEventGA';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import styles from './Footer.module.css';

interface FooterProps {
  backgroundColor?: 'transparent' | 'white';
}

export default function Footer(
  { backgroundColor }: FooterProps = { backgroundColor: 'white' }
) {
  const [isWithDrawalModalOpen, setIsWithDrawalModalOpen] = useState(false);

  // 탈퇴 처리 함수
  const handleWithdrawal = async () => {
    trackEvent({
      event: GAEvent.Auth.REMOVE_ACCOUNT,
      event_category: GACategory.AUTH,
    });

    try {
      const accessToken = tokenManager.getAccessToken();

      if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetchWithAuth('/api/member/withdrawal', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('탈퇴가 완료되었습니다.');
        // 토큰 삭제하고 홈으로 이동
        tokenManager.removeAccessToken();
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        alert(`탈퇴에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('탈퇴 중 오류가 발생했습니다.');
    }
  };

  const handleExternalLink = (type: keyof typeof GAEvent.Footer) => {
    trackEvent({
      event: GAEvent.Footer[type],
      event_category: GACategory.FOOTER,
    });
  };

  return (
    <footer
      className={`${styles.footer} ${
        backgroundColor === 'white' ? styles.whiteBackground : ''
      }`}
    >
      <div className={styles.container}>
        {/* Logo section */}
        <div className={styles.logoSection}>
          <Image
            src={logo}
            alt="조각조각"
            width={148.27}
            height={29.13}
            className={styles.logo}
          />
        </div>

        {/* Main content section */}
        <div className={styles.mainContent}>
          {/* Links */}
          <nav className={styles.linkContainer}>
            <Link
              href="/?intro=true"
              className={styles.link}
              onClick={() => handleExternalLink('ABOUT_US')}
            >
              서비스 소개
            </Link>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/FAQ-23e02f1ef63480679aebe4b2172852f1?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('CONTACT_US')}
            >
              문의하기
            </a>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/23e02f1ef634800cb29ddda947b3ae52?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('TERMS_OF_SERVICE')}
            >
              이용약관
            </a>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/22d02f1ef634808aa79ad41a0f2c3655"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('PRIVACY_POLICY')}
            >
              개인정보 처리방침
            </a>
          </nav>

          {/* Contact and copyright */}
          <div className={styles.contactSection}>
            <div className={styles.emailContainer}>
              <Image
                src={emailIcon}
                alt="이메일"
                width={13.33}
                height={10.67}
                className={styles.emailIcon}
              />
              <span className={styles.email}>jogakjogakhelp@gmail.com</span>
            </div>
            <p className={styles.copyright}>
              © 2025. JogakJogak. All rights reserved.
            </p>
          </div>

          {/* Withdraw link */}
          <button
            onClick={() => setIsWithDrawalModalOpen(true)}
            className={styles.withdrawLink}
          >
            탈퇴하기
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isWithDrawalModalOpen}
        onClose={() => setIsWithDrawalModalOpen(false)}
        onConfirm={handleWithdrawal} // 탈퇴 확인 함수
        title="정말 탈퇴하시겠습니까?"
        message="저장한 회원 기록이 모두 삭제돼요."
        cancelText="아니요"
        confirmText="확인"
        highlightedText="탈퇴"
      />
    </footer>
  );
}
