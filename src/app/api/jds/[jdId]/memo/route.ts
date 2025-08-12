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
    const { memo } = body;

    // 백엔드 서버로 메모 수정 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds/${jdId}/memo`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memo }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          code: response.status,
          message: data.message || 'Failed to update memo',
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Memo update error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
