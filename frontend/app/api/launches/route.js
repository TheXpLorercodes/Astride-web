import { NextResponse } from 'next/server';

export async function GET() {
  // Using The Space Devs / Launch Library 2 API
  // Free tier: https://lldev.thespacedevs.com/2.2.0/launch/upcoming/
  const url = 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=10';

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Launch Library API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
}
