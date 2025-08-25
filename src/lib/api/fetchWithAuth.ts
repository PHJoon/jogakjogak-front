import { reissueToken } from '@/lib/api/auth/authApi';
import { tokenManager } from '@/lib/api/tokenManager';

function buildHeaders(
  accessToken: string | null,
  options: RequestInit
): HeadersInit {
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return headers;
}

// API 요청 래퍼 함수
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = tokenManager.getAccessToken();

  let headers = buildHeaders(accessToken, options);

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 쿠키 포함
  });

  // 토큰 만료 시 재발급 시도
  if (response.status === 401) {
    const reissued = await reissueToken();

    if (reissued) {
      // 새 토큰으로 재시도
      const newAccessToken = tokenManager.getAccessToken();
      headers = buildHeaders(newAccessToken, options);

      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      // 재발급 실패 시 로그인 페이지로 리다이렉트
      tokenManager.removeAccessToken();
      window.location.href = '/?error=session_expired';
    }
  }

  return response;
}
