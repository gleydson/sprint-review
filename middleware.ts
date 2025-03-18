import {
  type MiddlewareConfig,
  type NextRequest,
  NextResponse,
} from 'next/server';

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = publicRoutes.find(route => route.path === pathname);
  const authToken = request.cookies.get('auth-token');

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!(authToken || publicRoute)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    // validate the token
    // if the token is invalid, clear the cookie and redirect to sign-in
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
