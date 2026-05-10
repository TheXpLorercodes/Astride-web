import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import {
  DASHBOARD_AUTH_COOKIE,
  DASHBOARD_AUTH_TTL_SECONDS,
  createDashboardAuthToken,
  getDashboardAuthSecret,
} from '../../../../lib/dashboardAuth';

function setAuthCookie(response, value, maxAge = DASHBOARD_AUTH_TTL_SECONDS) {
  response.cookies.set({
    name: DASHBOARD_AUTH_COOKIE,
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

export async function POST(request) {
  try {
    const secret = getDashboardAuthSecret();
    if (!secret) {
      return NextResponse.json({ error: 'Dashboard auth secret is not configured.' }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const accessToken = typeof body?.accessToken === 'string' ? body.accessToken.trim() : '';
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token.' }, { status: 400 });
    }

    const { data, error } = await supabaseServer.auth.getUser(accessToken);
    const user = data?.user;

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const token = await createDashboardAuthToken(user, secret);
    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('[dashboard auth] Failed to create session:', error);
    return NextResponse.json({ error: 'Unable to create dashboard session.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  setAuthCookie(response, '', 0);
  return response;
}