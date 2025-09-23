import { ApiResponse } from '@/types';
import { Profile } from '@/types/profile';
import throwIfNotOk from '@/utils/throwIfNotOk';

import { fetchWithAuth } from '../fetchWithAuth';

// 마이페이지 정보 조회
export async function getMyProfile() {
  const response = await fetchWithAuth('/api/member/my_page', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await throwIfNotOk(response, '유저 정보를 가져오는 중 문제가 발생했습니다.');

  const data: ApiResponse<Profile> = await response.json();
  return data.data;
}

// 유저 정보 패치
export async function updateMyProfile({ nickname }: { nickname: string }) {
  const response = await fetchWithAuth('/api/member/my_page/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname,
    }),
  });
  await throwIfNotOk(
    response,
    '유저 정보를 업데이트하는 중 문제가 발생했습니다.'
  );
  const data: ApiResponse<Profile> = await response.json();
  return data.data;
}

// 유저 알림 기능 온오프
export async function toggleUserNotification() {
  const response = await fetchWithAuth('/api/member/notification/on-off', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await throwIfNotOk(
    response,
    '유저 알림 기능을 토글하는 중 문제가 발생했습니다.'
  );
  const data: ApiResponse<string> = await response.json();
  return data.data;
}

// 온보딩 완료 처리
export async function updateIsOnboarded(onboarded: boolean) {
  const response = await fetchWithAuth(
    '/api/member/my_page/update_is_onboarded',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        onboarded,
      }),
    }
  );
  await throwIfNotOk(
    response,
    '온보딩 상태를 업데이트하는 중 문제가 발생했습니다.'
  );
  const data: ApiResponse<{ onboarded: boolean }> = await response.json();
  return data.data;
}
