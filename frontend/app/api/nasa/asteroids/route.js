import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('start_date') || new Date().toISOString().split('T')[0];
  
  const NASA_KEY = process.env.NASA_API_KEY?.trim();
  if (!NASA_KEY) return NextResponse.json({ error: 'NASA_API_KEY not configured' }, { status: 500 });

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&api_key=${NASA_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `NASA API Error: ${res.status}`, detail: errText }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Asteroid Fetch Failed', detail: err.message }, { status: 502 });
  }
}
