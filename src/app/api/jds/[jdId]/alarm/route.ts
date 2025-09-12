import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jdId: string }> }
) {
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

    const { jdId } = await params;
    const requestBody = await request.json();

    // 백엔드 서버로 요청
    const response = await fetch(`${API_BASE_URL}/jds/${jdId}/alarm`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Next server error [PATCH /api/jds/[jdId]/alarm]: ', error);
    return NextResponse.json(
      {
        errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
        message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
