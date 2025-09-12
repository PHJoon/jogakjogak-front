import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
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
    // 백엔드 서버로 요청
    const response = await fetch(`${API_BASE_URL}/member/notification/on-off`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      'Next server error [POST /api/member/notification/on-off]: ',
      error
    );
    return NextResponse.json(
      {
        errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
        message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
