import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

// 로그아웃 리다이렉트로 들어온 경우
export async function GET(request: NextRequest) {
  let redirectParams = '';
  const searchParams = request.nextUrl.searchParams;
  const errorCode = searchParams.get('error');
  const refreshToken = request.cookies.get('refresh')?.value ?? null;

  if (errorCode) {
    redirectParams = `?error=${errorCode}`;
  }

  if (refreshToken) {
    try {
      // 백엔드 서버로 로그아웃 요청
      const response = await fetch(`${API_BASE_URL}/member/logout`, {
        method: 'POST',
        headers: {
          Cookie: `refresh=${refreshToken}`,
        },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) {
        redirectParams = `?error=${data?.message || ERROR_CODES.INVALID_REFRESH_TOKEN}`;
      }
    } catch (error: unknown) {
      console.error('Logout error:', error);
      redirectParams = `?error=${ERROR_CODES.NEXT_SERVER_ERROR}`;
    }
  }

  console.log(redirectParams);

  const nextResponse = NextResponse.redirect(
    new URL(`/${redirectParams}`, request.url),
    {
      status: 303,
    }
  );

  // 쿠키 토큰 삭제
  nextResponse.cookies.delete('refresh');
  nextResponse.cookies.delete('access_token');

  // 클라이언트 캐시 제거하는 플래그
  nextResponse.cookies.set('clear_cache', '1', {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 5,
    path: '/',
  });

  return nextResponse;
}

// 로그아웃 버튼 클릭 처리
export async function POST(request: NextRequest) {
  let response: Response | null = null;
  let nextResponse: NextResponse | null = null;

  const refreshToken = request.cookies.get('refresh')?.value ?? null;

  if (!refreshToken) {
    nextResponse = NextResponse.json(
      {
        errorCode: ERROR_CODES.NO_REFRESH_TOKEN,
        message: ERROR_MESSAGES.NO_REFRESH_TOKEN,
      },
      { status: 401 }
    );
  } else {
    try {
      // 백엔드 서버로 로그아웃 요청
      response = await fetch(`${API_BASE_URL}/member/logout`, {
        method: 'POST',
        headers: {
          Cookie: `refresh=${refreshToken}`,
        },
        cache: 'no-store',
      });
      const data = await response.json();
      nextResponse = NextResponse.json(data, { status: response.status });
    } catch (error) {
      nextResponse = NextResponse.json(
        {
          errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
          message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
        },
        { status: 500 }
      );
    }
  }

  // 쿠키 토큰 삭제
  nextResponse.cookies.delete('refresh');
  nextResponse.cookies.delete('access_token');

  // 클라이언트 캐시 제거하는 플래그
  nextResponse.cookies.set('clear_cache', '1', {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 5,
    path: '/',
  });

  return nextResponse;
}
