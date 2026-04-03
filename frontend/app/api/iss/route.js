import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
      signal: controller.signal,
      next: { revalidate: 15 }, // ISS moves ~8km/s — refresh every 15s
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
