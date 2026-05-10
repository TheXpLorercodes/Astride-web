const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const DASHBOARD_AUTH_COOKIE = 'astride-dashboard-auth';
export const DASHBOARD_AUTH_TTL_SECONDS = 60 * 60 * 24 * 30;

export function getDashboardAuthSecret() {
  return process.env.AUTH_COOKIE_SECRET || '';
}

function toBase64(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(base64) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function toBase64Url(bytes) {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return fromBase64(normalized + padding);
}

async function importHmacKey(secret) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  return subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signPayload(payloadPart, secret) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  const key = await importHmacKey(secret);
  const signature = await subtle.sign('HMAC', key, textEncoder.encode(payloadPart));
  return toBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payloadPart, signaturePart, secret) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  const key = await importHmacKey(secret);
  return subtle.verify('HMAC', key, fromBase64Url(signaturePart), textEncoder.encode(payloadPart));
}

export function buildDashboardAuthPayload(user) {
  const now = Math.floor(Date.now() / 1000);

  return {
    sub: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
    iat: now,
    exp: now + DASHBOARD_AUTH_TTL_SECONDS,
  };
}

export async function createDashboardAuthToken(user, secret = getDashboardAuthSecret()) {
  if (!secret) {
    throw new Error('Missing dashboard auth secret.');
  }

  const payload = buildDashboardAuthPayload(user);
  const payloadPart = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signaturePart = await signPayload(payloadPart, secret);
  return `${payloadPart}.${signaturePart}`;
}

export async function verifyDashboardAuthToken(token, secret = getDashboardAuthSecret()) {
  if (!token || !secret) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [payloadPart, signaturePart] = parts;

  try {
    const isValid = await verifyPayload(payloadPart, signaturePart, secret);
    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(textDecoder.decode(fromBase64Url(payloadPart)));
    if (!payload || typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}