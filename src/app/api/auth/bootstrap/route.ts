import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh')?.value;
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const redirectUrl = redirectParam
      ? decodeURIComponent(redirectParam)
      : '/dashboard';

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

    const nextResponse = NextResponse.redirect(
      new URL(redirectUrl, request.url),
      {
        status: 303,
      }
    );

    nextResponse.headers.append('Cache-Control', 'no-store');

    // 새로운 리프레시 토큰 재설정
    const setCookie = response?.headers.get('set-cookie');
    if (setCookie) {
      // 쉼표로 연결된 다중 Set-Cookie를 안전하게 분리
      const parts = setCookie.split(/,(?=\s*\w+=)/).map((s) => s.trim());
      for (const c of parts) {
        nextResponse.headers.append('set-cookie', c);
      }
    }

    nextResponse.cookies.set('access_token', data.data, {
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
