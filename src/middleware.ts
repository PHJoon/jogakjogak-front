import { NextRequest, NextResponse } from 'next/server';

const WITH_AUTH = ['/dashboard', '/resume', '/job', '/mypage'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessTokenFromCookie = request.cookies.get('access_token')?.value;
  const refreshTokenFromCookie = request.cookies.get('refresh')?.value;
  const hasAccessToken = !!accessTokenFromCookie;
  const hasRefreshToken = !!refreshTokenFromCookie;

  // 루트 경로('/') 에서만 실행
  if (pathname === '/') {
    // intro 파라미터가 있으면 소개 페이지 표시
    const showIntro = searchParams.get('intro') === 'true';
    if (showIntro) {
      return NextResponse.next();
    }

    // error 파라미터 있어도 그대로 진행
    const error = searchParams.get('error');
    if (error) {
      return NextResponse.next();
    }
  }

  if (pathname === '/login') {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // if (hasRefreshToken) {
    //   return NextResponse.redirect(
    //     new URL('/api/auth/bootstrap?redirect=/dashboard', request.url)
    //   );
    // }
  }

  if (WITH_AUTH.some((path) => pathname.startsWith(path))) {
    if (hasAccessToken) {
      return NextResponse.next();
    }

    // const nextResponse = NextResponse.redirect(
    //   new URL(
    //     `/api/auth/bootstrap?redirect=${encodeURIComponent(request.url)}`,
    //     request.url
    //   )
    // );

    // nextResponse.headers.append(
    //   'Cache-Control',
    //   'no-store, no-cache, must-revalidate'
    // );
    // nextResponse.headers.append('Pragma', 'no-cache');
    // nextResponse.headers.append('Expires', '0');

    // if (!hasAccessToken) {
    //   return nextResponse;
    // }
  }

  return NextResponse.next();
}

// 제외되는 경로 설정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
