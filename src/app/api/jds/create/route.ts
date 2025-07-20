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
    const { title, companyName, job, content, link, endDate } = body;

    // 필수 필드 검증
    if (!title || !companyName || !job || !content || !endDate) {
      return NextResponse.json(
        { 
          code: 400, 
          message: 'Missing required fields: title, companyName, job, content, endDate are required' 
        },
        { status: 400 }
      );
    }

    // 백엔드 서버로 채용공고 생성 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          companyName,
          job,
          content,
          jdUrl: link || "",  // link → jdUrl, 빈 문자열 기본값
          endedAt: `${endDate}T23:59:59`  // DateTime 형식으로 변환
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 백엔드 에러 형식에 맞춰 처리
      const errorMessage = data.message || data.errorMessage || 'Failed to create JD';
      
      return NextResponse.json(
        { 
          code: response.status, 
          message: errorMessage,
          errorCode: data.errorCode
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('JD creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        code: 500, 
        message: `Internal server error: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}