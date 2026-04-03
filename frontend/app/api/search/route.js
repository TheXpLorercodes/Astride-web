import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const tables = ['planets', 'stars', 'galaxies', 'asteroids', 'missions', 'space_phenomena'];
  const label = { planets: '🪐 Planet', stars: '⭐ Star', galaxies: '🌌 Galaxy', asteroids: '☄️ Asteroid', missions: '🚀 Mission', space_phenomena: '💫 Phenomenon' };

  const queries = tables.map((table) =>
    supabaseServer
      .from(table)
      .select('id, name, description')
      .ilike('name', `%${q}%`)
      .limit(4)
  );

  const results = await Promise.all(queries);
  const combined = [];
  results.forEach((res, i) => {
    if (res.data) {
      res.data.forEach((item) => {
        combined.push({ ...item, table: tables[i], typeLabel: label[tables[i]] });
      });
    }
  });

  return NextResponse.json({ results: combined });
}
