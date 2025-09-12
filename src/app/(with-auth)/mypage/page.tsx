'use client';

import type { SubmitHandler } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import backIcon from '@/assets/images/ic_back.svg';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import Toggle from '@/components/common/Toggle';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useProfileMutation from '@/hooks/mutations/mypage/useProfileMutation';
import useWithdrawalMutation from '@/hooks/mutations/mypage/useWithdrawalMutation';
import useProfileForm from '@/hooks/mypage/useProfileForm';
import useMyProfileQuery from '@/hooks/queries/useMyProfileQuery';
import { logout, withdrawal } from '@/lib/api/auth/authApi';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';
import { ProfileFormInput } from '@/types/profile';
import trackEvent from '@/utils/trackEventGA';

import styles from './page.module.css';

function MyPageLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profileForm}>
          <div className={styles.titleWrapper}>
            <div className={styles.backBtnLoading} />
            <h1 className={styles.title}>마이페이지</h1>
          </div>
          <div className={styles.accountInfoSection}>
            <h2 className={`${styles.subTitle}`}>로그인 정보</h2>
            <div className={styles.inputGroup}>
              <div
                className={`${styles.inputLoading} ${styles.skeleton}`}
              ></div>
              <div
                className={`${styles.inputLoading} ${styles.skeleton}`}
              ></div>
            </div>
          </div>
          <div className={`${styles.buttonLoading} ${styles.skeleton}`}></div>
        </div>
        <div className={styles.notificationSection}>
          <h2 className={`${styles.subTitle}`}>이메일 알림 설정</h2>
          <div className={`${styles.inputLoading} ${styles.skeleton}`}></div>
        </div>
        <div className={styles.dangerZone}>
          <div className={styles.logout}>로그아웃</div>
          <div className={styles.withdraw}>탈퇴하기</div>
        </div>
      </div>
    </main>
  );
}

export default function MyPage() {
  const router = useRouter();
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] =
    useState(false);
  const [isEmailNotificationModalOpen, setIsEmailNotificationModalOpen] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithDrawalModalOpen, setIsWithDrawalModalOpen] = useState(false);
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const { fields, nickname, email, errors, handleSubmit, reset } =
    useProfileForm();

  const { data, isLoading } = useMyProfileQuery();
  const {
    updateProfileMutate,
    isUpdateProfilePending,
    toggleNotificationMutate,
    isToggleNotificationPending,
  } = useProfileMutation();

  const isFormDirty = () => {
    return nickname !== data?.nickname;
  };

  const { withdrawalMutation } = useWithdrawalMutation();

  // 프로필 데이터 세팅
  useEffect(() => {
    if (data) {
      reset({
        nickname: data.nickname,
        email: data.email,
      });
      setIsEmailNotificationEnabled(data.notificationEnabled);
    }
  }, [data, reset]);

  // 로그아웃
  const handleLogoutClick = async () => {
    trackEvent({
      event: GAEvent.Auth.LOGOUT,
      event_category: GACategory.AUTH,
    });

    await logout()
      .catch((error) => {
        console.warn('[logout failed]', (error as Error)?.message);
      })
      .finally(() => {
        setSnackbar({
          type: 'success',
          message: '로그아웃 되었습니다.',
        });
        router.replace('/');
      });
  };

  // 탈퇴하기
  const handleWithdrawal = async () => {
    trackEvent({
      event: GAEvent.Auth.REMOVE_ACCOUNT,
      event_category: GACategory.AUTH,
    });

    withdrawalMutation(undefined, {
      onSuccess: () => {
        setSnackbar({
          type: 'success',
          message: '탈퇴가 완료되었습니다.',
        });
        router.replace('/');
      },
    });
  };

  const handleBackClick = () => {
    router.back();
  };

  // 닉네임 설정 폼 제출 핸들러
  const onSubmit: SubmitHandler<Omit<ProfileFormInput, 'email'>> = (data) => {
    updateProfileMutate(
      {
        nickname: data.nickname,
      },
      {
        onError: (error) => {
          if (
            error instanceof HttpError &&
            error.errorCode === ERROR_CODES.REPLAY_REQUIRED
          ) {
            return;
          }
          setSnackbar({
            message: error.message || '프로필 업데이트 중 오류가 발생했습니다.',
            type: 'error',
          });
        },
        onSuccess: () => {
          setSnackbar({
            message: '프로필이 업데이트되었습니다.',
            type: 'success',
          });
        },
      }
    );
  };

  // 알림 설정 핸들러
  const handleToggleNotification = (newState: boolean) => {
    if (isToggleNotificationPending) return;
    toggleNotificationMutate(undefined, {
      onSuccess: () => {
        setSnackbar({
          message: newState
            ? '알림 기능이 켜졌습니다.'
            : '알림 기능이 해제되었습니다.',
          type: newState ? 'success' : 'info',
        });
      },
    });
  };

  if (isLoading) {
    return <MyPageLoading />;
  }

  return (
    <>
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

          <form
            className={styles.profileForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.accountInfoSection}>
              <h2 className={styles.subTitle}>로그인 정보</h2>
              <div className={styles.inputGroup}>
                <Input
                  id={'nickname'}
                  label="닉네임"
                  value={nickname}
                  field={fields.nickname}
                  maxLength={12}
                  warning={!!errors.nickname}
                />
                {errors.nickname && (
                  <ErrorMessage message={errors.nickname?.message || ''} />
                )}
                <Input
                  id={'email'}
                  label="가입 이메일"
                  value={email}
                  readOnly={true}
                  field={fields.email}
                />
              </div>
            </div>
            <Button
              variant={'primary'}
              style={{ width: '100%', height: '64px' }}
              type={'submit'}
              disabled={!isFormDirty()}
              isLoading={isUpdateProfilePending}
            >
              저장하기
            </Button>
          </form>

          <div className={styles.notificationSection}>
            <h2 className={styles.subTitle}>이메일 알림 설정</h2>
            <div className={styles.emailToggleWrapper}>
              <span>알림 기능</span>
              <Toggle
                isOn={isEmailNotificationEnabled}
                onChange={(next) => {
                  if (next) {
                    handleToggleNotification(next);
                    setIsEmailNotificationEnabled(true);
                    return;
                  }
                  setIsEmailNotificationModalOpen(true);
                }}
              />
              {/* 알림 끄기 모달 */}
              <DeleteConfirmModal
                isOpen={isEmailNotificationModalOpen}
                onClose={() => {
                  setIsEmailNotificationModalOpen(false);
                }}
                onConfirm={() => {
                  handleToggleNotification(false);
                  setIsEmailNotificationEnabled(false);
                  setIsEmailNotificationModalOpen(false);
                }}
                title="이메일 알림 기능을 끄시겠습니까??"
                message="더이상 알림을 받을 수 없어요."
                cancelText="취소"
                confirmText="확인"
              />
            </div>
          </div>

          <div className={styles.dangerZone}>
            <button
              className={styles.logout}
              onClick={() => setIsLogoutModalOpen(true)}
            >
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

        {/* 로그아웃 모달 */}
        <DeleteConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogoutClick}
          title="정말 로그아웃 하시겠습니까?"
          message="다시 로그인해야해요."
          cancelText="아니요"
          confirmText="확인"
          highlightedText="로그아웃"
        />

        {/* 회원 탈퇴 모달 */}
        <DeleteConfirmModal
          isOpen={isWithDrawalModalOpen}
          onClose={() => setIsWithDrawalModalOpen(false)}
          onConfirm={handleWithdrawal}
          title="정말 탈퇴하시겠습니까?"
          message="저장한 회원 기록이 모두 삭제돼요."
          cancelText="아니요"
          confirmText="확인"
          highlightedText="탈퇴"
        />
      </main>
    </>
  );
}
