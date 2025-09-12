import throwIfNotOk from '@/utils/throwIfNotOk';

import { fetchWithAuth } from '../fetchWithAuth';

// 로그아웃
export async function logout() {
  const response = await fetch('/api/member/logout', {
    method: 'POST',
    credentials: 'include',
  });

  await throwIfNotOk(response, 'Logout failed');
  const data = await response.json();
  return data;
}

// 탈퇴하기
export async function withdrawal() {
  const response = await fetchWithAuth('/api/member/withdrawal', {
    method: 'DELETE',
  });
  await throwIfNotOk(response, '회원 탈퇴 중에 오류가 발생했습니다.');
  const data = await response.json();
  return data;
}
