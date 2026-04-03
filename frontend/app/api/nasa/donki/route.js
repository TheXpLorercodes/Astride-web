import { NextResponse } from 'next/server';

export async function GET() {
  const NASA_KEY = process.env.NASA_API_KEY?.trim();
  if (!NASA_KEY) return NextResponse.json({ error: 'NASA_API_KEY not configured' }, { status: 500 });

  // Fetching Coronal Mass Ejections (CME) as a proxy for space weather activity
  const url = `https://api.nasa.gov/DONKI/CME?api_key=${NASA_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `NASA API Error: ${res.status}`, detail: errText }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data.slice(-10)); // Get latest 10 events
  } catch (err) {
    return NextResponse.json({ error: 'Space Weather Fetch Failed', detail: err.message }, { status: 502 });
  }
}
