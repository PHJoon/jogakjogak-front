// 토큰 관리 유틸리티
export const tokenManager = {
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      // 쿠키에도 저장 (middleware에서 접근 가능하도록)
      document.cookie = `accessToken=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
    }
  },

  removeAccessToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      // 쿠키도 제거
      document.cookie =
        'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  },

  getRefreshToken: async () => {
    // 서버에서 쿠키를 읽어야 하므로 API 호출 필요
    const response = await fetch('/api/auth/get-refresh-token', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.refresh_token;
  },
};
