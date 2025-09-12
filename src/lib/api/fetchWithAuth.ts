import { redirect } from 'next/navigation';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import throwIfNotOk from '@/utils/throwIfNotOk';

import { HttpError } from '../HttpError';

let refreshPromise: Promise<Response> | null = null;

function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/member/reissue', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// API 요청 래퍼 함수
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (typeof url === 'string' && url.startsWith('/api/member/reissue')) {
    return fetch(url, { ...options });
  }

  const response = await fetch(url, { ...options });
  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await refreshOnce();

  // 리프레시 토큰이 없거나 만료된 경우 에러 throw
  await throwIfNotOk(refreshResponse, ERROR_MESSAGES.TOKEN_REISSUE_FAILED);

  const isSafe = options.method === 'GET' || options.method === 'HEAD';

  if (!isSafe) {
    throw new HttpError(
      ERROR_MESSAGES.REPLAY_REQUIRED,
      401,
      undefined,
      ERROR_CODES.REPLAY_REQUIRED
    );
  }

  return fetch(url, { ...options });
}
