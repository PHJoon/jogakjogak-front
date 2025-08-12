import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 루트 경로('/') 에서만 실행
  if (pathname === '/') {
    // intro 파라미터가 있으면 소개 페이지 표시
    const showIntro = searchParams.get('intro') === 'true';
    if (showIntro) {
      return NextResponse.next();
    }

    // Authorization 헤더에서 토큰 확인
    const authHeader = request.headers.get('authorization');
    // 쿠키에서 토큰 확인 (브라우저에서는 보통 쿠키에 저장됨)
    const tokenFromCookie = request.cookies.get('accessToken')?.value;
    const tokenFromAuth = authHeader?.replace('Bearer ', '');

    const hasToken = tokenFromCookie || tokenFromAuth;

    // 로그인 상태이고 intro 파라미터가 없으면 대시보드로 리다이렉트
    if (hasToken) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
