import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || '';
  const count = searchParams.get('count') || '';

  const NASA_KEY = process.env.NASA_API_KEY;
  if (!NASA_KEY) return NextResponse.json({ error: 'NASA_API_KEY not configured' }, { status: 500 });

  let url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&thumbs=true`;
  if (date) url += `&date=${date}`;
  if (count) url += `&count=${count}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1hr — APOD changes daily
    if (!res.ok) throw new Error(`NASA API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
