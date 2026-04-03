import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'nebula';
  const url = `https://images-api.nasa.gov/search?q=${query}&media_type=image`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA Image Library API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
