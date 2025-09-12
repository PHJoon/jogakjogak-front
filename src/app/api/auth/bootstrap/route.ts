import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh')?.value;
    const redirect =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';

    if (!refreshToken) {
      return NextResponse.redirect(
        new URL(
          `/api/member/logout?error=${ERROR_CODES.NO_REFRESH_TOKEN}`,
          request.url
        ),
        { status: 303 }
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
      return NextResponse.redirect(
        new URL(`/api/member/logout?error=${data.errorCode}`, request.url),
        {
          status: 303,
        }
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
      return NextResponse.redirect(
        new URL(
          `/api/member/logout?error=${ERROR_CODES.TOKEN_REISSUE_FAILED}`,
          request.url
        ),
        {
          status: 303,
        }
      );
    }

    const nextResponse = NextResponse.redirect(new URL(redirect, request.url), {
      status: 303,
    });

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

    nextResponse.cookies.set('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return nextResponse;
  } catch (error) {
    console.error('Next server error [GET /api/auth/bootstrap]: ', error);
    return NextResponse.redirect(
      new URL(
        `/api/member/logout?error=${ERROR_CODES.NEXT_SERVER_ERROR}`,
        request.url
      ),
      {
        status: 303,
      }
    );
  }
}
