import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let refresh_token;

    // Content-Type과 body 존재 여부 확인
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        const body = await request.json();
        refresh_token = body.refresh_token;
      } catch {
        // JSON 파싱 실패 시 refresh_token 없음으로 처리
      }
    }

    if (!refresh_token) {
      // refresh_token이 없어도 쿠키는 삭제하고 성공 응답
      const res = NextResponse.json({
        code: 200,
        message: 'Logged out successfully (no token)',
      });
      res.cookies.delete('refresh');
      return res;
    }

    // 백엔드 서버로 로그아웃 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.jogakjogak.com'}/member/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      }
    );

    const data = await response.json();

    // 로그아웃 성공 여부와 관계없이 쿠키 삭제
    const res = NextResponse.json(data);
    res.cookies.delete('refresh'); // 쿠키 이름을 refresh로 변경

    return res;
  } catch (error) {
    console.error('Logout error:', error);
    // 에러가 발생해도 쿠키는 삭제
    const res = NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
    res.cookies.delete('refresh');
    return res;
  }
}
