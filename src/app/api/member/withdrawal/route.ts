import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function DELETE(request: NextRequest) {
  let response: Response | null = null;
  let data;

  try {
    const accessToken = request.cookies.get('access_token')?.value ?? null;
    if (!accessToken) {
      return NextResponse.json(
        {
          errorCode: ERROR_CODES.NO_ACCESS_TOKEN,
          message: ERROR_MESSAGES.NO_ACCESS_TOKEN,
        },
        { status: 401 }
      );
    }
    // 백엔드 서버로 회원 탈퇴 요청
    response = await fetch(`${API_BASE_URL}/member/withdrawal`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Next server error [DELETE /api/member/withdrawal]: ', error);
    return NextResponse.json(
      {
        errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
        message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
      },
      { status: 500 }
    );
  }

  const nextResponse = NextResponse.json(data, { status: response.status });

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
