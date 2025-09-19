import { NextRequest, NextResponse } from 'next/server';

const WITH_AUTH = ['/dashboard', '/resume', '/job', '/mypage'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessTokenFromCookie = request.cookies.get('access_token')?.value;
  const hasAccessToken = !!accessTokenFromCookie;

  // 루트 경로('/') 에서만 실행
  if (pathname === '/') {
    // intro or error 파라미터가 있으면 소개 페이지 표시
    const showIntro = searchParams.get('intro') === 'true';
    const error = searchParams.get('error');
    if (showIntro || error) {
      return NextResponse.next();
    }

    // 토큰이 있으면 대시보드로 리다이렉트
    if (hasAccessToken) {
      const res = NextResponse.redirect(new URL('/dashboard', request.url));
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.headers.set('Pragma', 'no-cache');
      res.headers.set('Expires', '0');
      return res;
    }
  }

  // 로그인 페이지에 접근하는 경우
  if (pathname === '/login') {
    if (hasAccessToken) {
      const res = NextResponse.redirect(new URL('/dashboard', request.url));
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.headers.set('Pragma', 'no-cache');
      res.headers.set('Expires', '0');
      return res;
    }
    return NextResponse.next();
  }

  // 인증이 필요한 경로에 접근하는 경우
  if (WITH_AUTH.some((path) => pathname.startsWith(path))) {
    if (!hasAccessToken) {
      const redirectUrl = new URL(
        `/api/auth/bootstrap?redirect=${encodeURIComponent(request.url)}`,
        request.url
      );
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.headers.set('Pragma', 'no-cache');
      res.headers.set('Expires', '0');
      return res;
    }

    // 토큰 있으면 통과 + 캐시 금지
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  }

  return NextResponse.next();
}

// 제외되는 경로 설정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
