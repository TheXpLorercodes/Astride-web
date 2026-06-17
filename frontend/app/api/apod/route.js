import { NextResponse } from 'next/server';

const APOD_FALLBACK = {
  title: 'Milky Way Over Earth',
  explanation:
    'NASA APOD is temporarily unavailable, so Astride is showing a local cosmic fallback while the upstream service recovers.',
  date: new Date().toISOString().slice(0, 10),
  media_type: 'image',
  url: '/milky-way.jpg',
  hdurl: '/milky-way.jpg',
  copyright: 'Astride',
  fallback: true,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = (searchParams.get('date') || '').trim();
  const parsedCount = Number.parseInt(searchParams.get('count') || '', 10);

  const NASA_KEY = process.env.NASA_API_KEY;
  if (!NASA_KEY) return NextResponse.json({ error: 'NASA_API_KEY not configured' }, { status: 500 });

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
  }

  const count = Number.isFinite(parsedCount) ? Math.min(Math.max(parsedCount, 1), 12) : null;

  const url = new URL('https://api.nasa.gov/planetary/apod');
  url.searchParams.set('api_key', NASA_KEY);
  url.searchParams.set('thumbs', 'true');
  if (date) url.searchParams.set('date', date);
  if (count) url.searchParams.set('count', String(count));

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1hr — APOD changes daily
    if (!res.ok) throw new Error(`NASA API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json(APOD_FALLBACK, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'X-Astride-Fallback': 'apod',
      },
    });
  }
}
