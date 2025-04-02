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
  const jiraDomain = request.cookies.get('jira-domain');
  const authToken = request.cookies.get('auth-token');
  const isAuthenticated = !!(jiraDomain && authToken);

  if (!isAuthenticated && publicRoute) {
    return NextResponse.next();
  }

  if (!(isAuthenticated || publicRoute)) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
  }

  if (
    isAuthenticated &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (isAuthenticated && !publicRoute) {
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
