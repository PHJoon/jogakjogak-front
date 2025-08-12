import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { refresh_token } = body;

    // refresh_token이 없는 경우 쿠키에서 읽기
    if (!refresh_token) {
      refresh_token = request.cookies.get('refresh')?.value;
    }

    if (!refresh_token) {
      return NextResponse.json(
        { code: 400, message: 'refresh_token is required' },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com';

    // 백엔드 서버로 토큰 재발급 요청 - 쿠키로 전송
    const response = await fetch(`${backendUrl}/member/reissue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh=${refresh_token}`,
      },
    });

    // Set-Cookie 헤더 확인
    const setCookieHeader = response.headers.get('set-cookie');
    const data = await response.json();

    // 백엔드 응답 처리
    if (response.status === 200 && data.status === 'OK') {
      // 백엔드가 data 필드에 직접 access token을 문자열로 보냄
      const accessToken = data.data;

      // Set-Cookie에서 새로운 refresh token 찾기
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

      // 프론트엔드가 기대하는 형식으로 응답 생성
      const responseData = {
        code: 200,
        data: {
          access_token: accessToken,
          refresh_token: newRefreshToken || refresh_token,
        },
        message: 'Token reissued successfully',
      };

      const res = NextResponse.json(responseData);

      // 새로운 refresh token을 프론트엔드 쿠키에도 저장
      if (newRefreshToken) {
        res.cookies.set('refresh', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30일
        });
      }

      return res;
    } else {
      return NextResponse.json(data || { code: response.status }, {
        status: response.status,
      });
    }
  } catch (error) {
    console.error('Token reissue error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
