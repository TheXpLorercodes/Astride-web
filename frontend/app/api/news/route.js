import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '12';
  const offset = searchParams.get('offset') || '0';

  try {
    const res = await fetch(
      `https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}&offset=${offset}&ordering=-published_at`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`News API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
