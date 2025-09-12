import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const hasAccessToken = !!(
      request.cookies.get('access_token')?.value ?? null
    );
    return NextResponse.json(
      {
        isLoggedIn: hasAccessToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Next server error [GET /api/auth/session]: ', error);
    return NextResponse.json(
      {
        isLoggedIn: false,
      },
      { status: 500 }
    );
  }
}
