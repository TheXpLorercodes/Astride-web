export async function persistDashboardAuthSession(accessToken) {
  if (!accessToken) {
    return { ok: false, error: 'Missing access token.' };
  }

  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, error: payload.error || 'Unable to create dashboard session.' };
    }

    return { ok: true, user: payload.user || null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to create dashboard session.',
    };
  }
}

export function normalizeDashboardRedirectTarget(target, fallback = '/dashboard') {
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//')) {
    return fallback;
  }

  return target;
}

export async function clearDashboardAuthSession() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
    });

    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}