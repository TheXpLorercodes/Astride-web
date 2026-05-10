import { NextResponse } from 'next/server';
import { DASHBOARD_AUTH_COOKIE, verifyDashboardAuthToken } from './lib/dashboardAuth';

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(DASHBOARD_AUTH_COOKIE)?.value || '';
  const session = await verifyDashboardAuthToken(token);

  if (pathname.startsWith('/dashboard') && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('redirectTo', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/auth/login' || pathname === '/auth/signup') && session) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    dashboardUrl.search = '';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/signup'],
};