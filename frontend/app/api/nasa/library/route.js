import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || 'nebula').trim() || 'nebula';

  if (query.length > 80) {
    return NextResponse.json({ error: 'Query too long.' }, { status: 400 });
  }

  const url = new URL('https://images-api.nasa.gov/search');
  url.searchParams.set('q', query);
  url.searchParams.set('media_type', 'image');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA Image Library API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
