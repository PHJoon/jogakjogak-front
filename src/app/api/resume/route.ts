import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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
    const { title, content } = body;

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { code: 400, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (title.length > 30) {
      return NextResponse.json(
        { code: 400, message: 'Title must be 30 characters or less' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { code: 400, message: 'Content must be 5000 characters or less' },
        { status: 400 }
      );
    }

    // 백엔드 서버로 이력서 생성 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/resume`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { code: response.status, message: data.message || 'Failed to create resume' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Resume creation error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}