import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import { API_BASE_URL } from '@/lib/config';

// 이력서 스킬 단어 조회
export async function GET(request: NextRequest) {
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

    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const searchSkill = searchParams.get('q') || '0';

    const queryParams = new URLSearchParams({
      q: searchSkill,
    });

    const queryString = queryParams.toString();

    // 백엔드 서버로 이력서 스킬 단어 조회 요청
    const response = await fetch(
      `${API_BASE_URL}/resume/skill-word?${queryString}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Next server error [GET /api/resume]: ', error);
    return NextResponse.json(
      {
        errorCode: ERROR_CODES.NEXT_SERVER_ERROR,
        message: ERROR_MESSAGES.NEXT_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
