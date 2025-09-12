import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          errorCode: ERROR_CODES.NO_REFRESH_TOKEN,
          message: ERROR_MESSAGES.NO_REFRESH_TOKEN,
        },
        { status: 401 }
      );
    }

    // 백엔드 서버로 토큰 재발급 요청
    const response = await fetch(`${API_BASE_URL}/member/reissue`, {
      method: 'POST',
      headers: {
        Cookie: `refresh=${refreshToken}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          errorCode: data.errorCode || ERROR_CODES.TOKEN_REISSUE_FAILED,
          message: data.message || ERROR_MESSAGES.TOKEN_REISSUE_FAILED,
        },
        { status: response.status }
      );
    }

    const setCookieHeader = response.headers.get('Set-Cookie');
    let newRefreshToken = null;
    if (setCookieHeader) {
      // Set-Cookie 헤더 파싱
      const cookies = setCookieHeader
        .split(/,(?=\s*\w+=)/)
        .map((c) => c.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith('refresh=')) {
          newRefreshToken = cookie.split('=')[1].split(';')[0];
          break;
        }
      }
    }

    const accessToken = data.data;
    if (!accessToken) {
      return NextResponse.json(
        {
          errorCode: ERROR_CODES.TOKEN_REISSUE_FAILED,
          message: ERROR_MESSAGES.TOKEN_REISSUE_FAILED,
        },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(data, { status: response.status });
    // 새로운 리프레시 토큰 재설정
    if (newRefreshToken) {
      nextResponse.cookies.set('refresh', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });
    }
    // 액세스 토큰 설정
    nextResponse.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/',
    });
    return nextResponse;
  } catch (error) {
    console.error('Next server error [POST /api/member/reissue]: ', error);
    return NextResponse.json(
      {
        errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
        message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
