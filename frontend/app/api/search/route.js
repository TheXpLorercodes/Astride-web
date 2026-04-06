import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { SATELLITES } from '../../../lib/cosmoDataApi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const tables = ['planets', 'stars', 'galaxies', 'asteroids', 'satellites', 'missions', 'space_phenomena'];
  const label = { planets: '🪐 Planet', stars: '⭐ Star', galaxies: '🌌 Galaxy', asteroids: '☄️ Asteroid', satellites: '🛰️ Satellite', missions: '🚀 Mission', space_phenomena: '💫 Phenomenon' };

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

  if (!combined.some((item) => item.table === 'satellites')) {
    SATELLITES.filter((item) => item.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 4)
      .forEach((item) => {
        combined.push({
          id: item.id,
          name: item.name,
          description: item.description,
          table: 'satellites',
          typeLabel: label.satellites
        });
      });
  }

  return NextResponse.json({ results: combined });
}
