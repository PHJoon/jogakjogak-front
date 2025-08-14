import { tokenManager } from '@/lib/auth/tokenManager';

// 토큰 재발급 함수
export async function reissueToken(): Promise<boolean> {
  try {
    const refreshToken = await tokenManager.getRefreshToken();

    const response = await fetch('/api/member/reissue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (data.code === 200 && data.data?.access_token) {
      tokenManager.setAccessToken(data.data.access_token);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token reissue failed:', error);
    return false;
  }
}

// 로그아웃 함수
export async function logout() {
  // 즉시 토큰 제거
  tokenManager.removeAccessToken();

  try {
    const refreshToken = await tokenManager.getRefreshToken();

    if (refreshToken) {
      await fetch('/api/member/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
