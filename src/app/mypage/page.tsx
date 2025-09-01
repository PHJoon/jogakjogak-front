'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import backIcon from '@/assets/images/ic_back.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Toggle from '@/components/common/Toggle';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { logout } from '@/lib/api/auth/authApi';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { tokenManager } from '@/lib/api/tokenManager';
import { queryClient } from '@/lib/queryClient';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

export default function MyPage() {
  const router = useRouter();
  const [isEmailNotificationEnabled, setEmailNotificationEnabled] =
    useState(false);
  const [isEmailNotificationModalOpen, setIsEmailNotificationModalOpen] =
    useState(false);
  const [isWithDrawalModalOpen, setIsWithDrawalModalOpen] = useState(false);

  // 로그아웃
  const handleLogoutClick = () => {
    trackEvent({
      event: GAEvent.Auth.LOGOUT,
      event_category: GACategory.AUTH,
    });
    // 즉시 UI 업데이트를 위해 홈으로 이동
    queryClient.clear();
    window.location.href = '/';

    // 백그라운드에서 로그아웃 처리
    logout().catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  // 탈퇴하기
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
        queryClient.clear();
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

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <Image
              src={backIcon}
              alt="뒤로가기"
              width={28}
              height={28}
              onClick={handleBackClick}
              className={styles.backIcon}
            />
            <h1 className={styles.title}>마이페이지</h1>
          </div>
          <div className={styles.accountInfoSection}>
            <h2 className={styles.subTitle}>로그인 정보</h2>
            <div className={styles.inputGroup}>
              <Input id={'nickname'} label="닉네임" defaultValue="" />
              <Input
                id={'email'}
                label="가입 이메일"
                defaultValue="email@example.com"
                readOnly={true}
              />
            </div>
          </div>

          <div className={styles.notificationSection}>
            <h2 className={styles.subTitle}>이메일 알림 설정</h2>
            <div className={styles.emailToggleWrapper}>
              <span>알림 기능</span>
              <Toggle
                isOn={isEmailNotificationEnabled}
                handleToggle={() => {
                  if (isEmailNotificationEnabled) {
                    setIsEmailNotificationModalOpen(true);
                  } else {
                    setEmailNotificationEnabled(true);
                  }
                }}
              />
            </div>
          </div>

          <Button
            variant={'primary'}
            style={{ width: '100%', height: '64px', marginBottom: '40px' }}
          >
            저장하기
          </Button>

          <div className={styles.dangerZone}>
            <button className={styles.logout} onClick={handleLogoutClick}>
              로그아웃
            </button>
            <button
              className={styles.withdraw}
              onClick={() => setIsWithDrawalModalOpen(true)}
            >
              회원탈퇴
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
        <DeleteConfirmModal
          isOpen={isEmailNotificationModalOpen}
          onClose={() => setIsEmailNotificationModalOpen(false)}
          onConfirm={() => {
            setEmailNotificationEnabled(false);
            setIsEmailNotificationModalOpen(false);
          }} // 탈퇴 확인 함수
          title="이메일 알림 기능을 끄시겠습니까??"
          message="더이상 알림을 받을 수 없어요."
          cancelText="취소"
          confirmText="확인"
          highlightedText="탈퇴"
        />
      </main>
      <Footer />
    </>
  );
}
