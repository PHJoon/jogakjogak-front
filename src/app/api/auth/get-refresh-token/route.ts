import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 refresh token 읽기
    const refreshToken = request.cookies.get('refresh')?.value;

    if (!refreshToken) {
      return NextResponse.json({ refresh_token: null }, { status: 200 });
    }

    return NextResponse.json({ refresh_token: refreshToken }, { status: 200 });
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return NextResponse.json(
      { error: 'Failed to get refresh token' },
      { status: 500 }
    );
  }
}
