import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const allowedRovers = new Set(['curiosity', 'perseverance', 'opportunity', 'spirit']);
  const roverInput = (searchParams.get('rover') || 'curiosity').toLowerCase();
  const rover = allowedRovers.has(roverInput) ? roverInput : 'curiosity';
  const parsedSol = Number.parseInt(searchParams.get('sol') || '100', 10);
  const sol = Number.isFinite(parsedSol) ? Math.min(Math.max(parsedSol, 0), 5000) : 100;
  
  // Using images-api as it's more stable than the specialized mars-photos API
  const query = `mars rover ${rover} sol ${sol}`;
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NASA Search API Error: ${res.status}`);
    const data = await res.json();
    
    // Transform to match the structure expected by the original Mars Gallery frontend
    const photos = (data.collection?.items || []).map((item, index) => {
      const info = item.data?.[0] || {};
      const link = item.links?.[0]?.href || '';
      
      return {
        id: info.nasa_id || `mars-${index}`,
        img_src: link,
        earth_date: info.date_created?.split('T')[0] || 'N/A',
        rover: { name: rover.toUpperCase() },
        camera: { full_name: info.center || 'NASA' },
        title: info.title
      };
    });

    return NextResponse.json({ photos });
  } catch (err) {
    console.error('Mars Refactor Error:', err);
    return NextResponse.json({ error: 'Search API Failure', detail: err.message }, { status: 502 });
  }
}
