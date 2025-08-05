import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    // 백엔드 서버로 JD 상세 조회 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds/${jdId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { code: response.status, message: data.message || 'Failed to fetch JD' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('JD fetch error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ jdId: string }> }
) {
  try {
    const { jdId } = await params;
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
          { code: 401, message: 'Unauthorized' },
          { status: 401 }
      );
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds/${jdId}/apply`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }

        }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
          { code: response.status, message: data.message || 'Failed to patch JD' },
          { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('JD patch error:', error);
    return NextResponse.json(
        { code: 500, message: 'Internal server error' },
        { status: 500 }
    );
  }
}

export async function DELETE(
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

    // 백엔드 서버로 JD 삭제 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/jds/${jdId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { code: response.status, message: data.message || 'Failed to delete JD' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('JD delete error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}