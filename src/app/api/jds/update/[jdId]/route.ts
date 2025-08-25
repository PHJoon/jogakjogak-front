import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jdId: string }> }
) {
  try {
    const { jdId } = await params;

    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, companyName, job, link, endDate } = body;

    // 필수 필드 검증
    if (!title || !companyName || !job) {
      return NextResponse.json(
        {
          code: 400,
          message:
            'Missing required fields: title, companyName, job are required',
        },
        { status: 400 }
      );
    }

    // 백엔드 서버로 채용공고 생성 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds/${jdId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          companyName,
          job,
          jdUrl: link || '', // link → jdUrl, 빈 문자열 기본값
          ...(endDate && { endedAt: `${endDate}T23:59:59` }), // endDate가 있을 때만 추가
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 백엔드 에러 형식에 맞춰 처리
      const errorMessage =
        data.message || data.errorMessage || 'Failed to create JD';

      return NextResponse.json(
        {
          code: response.status,
          message: errorMessage,
          errorCode: data.errorCode,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('JD creation error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        code: 500,
        message: `Internal server error: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
