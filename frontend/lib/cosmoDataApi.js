// CosmoData API — Server-side data functions
// Used in Server Components and API Routes

import { supabaseServer } from './supabaseServer';

const VALID_TABLES = ['planets', 'stars', 'galaxies', 'asteroids', 'missions', 'space_phenomena'];

export const EXOPLANETS = [
  { id: 'proxima-b', name: 'Proxima Centauri b', description: 'An exoplanet orbiting within the habitable zone of the red dwarf star Proxima Centauri.', color: '#ef4444', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Proxima_Centauri_b_ESO.jpg', diameter: '1.1 Earths', distance_from_sun: '4.24 light-years', is_exoplanet: true },
  { id: 'trappist-1e', name: 'TRAPPIST-1e', description: 'A solid, rocky, terrestrial exoplanet orbiting within the habitable zone of the ultra-cool dwarf star TRAPPIST-1.', color: '#d97706', image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/TRAPPIST-1e_artist_impression.jpg', diameter: '0.92 Earths', distance_from_sun: '39.6 light-years', is_exoplanet: true },
  { id: 'kepler-452b', name: 'Kepler-452b', description: 'A super-Earth exoplanet orbiting within the inner edge of the habitable zone of the sun-like star Kepler-452.', color: '#10b981', image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Kepler-452b_artist_concept.jpg', diameter: '1.6 Earths', distance_from_sun: '1,402 light-years', is_exoplanet: true },
  { id: '51-peg-b', name: '51 Pegasi b', description: 'The first exoplanet discovered orbiting a main-sequence star. It is a hot Jupiter.', color: '#8b5cf6', image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Exoplanet_Comparison_51_Pegasi_b.png', diameter: '1.9 Jupiters', distance_from_sun: '50.45 light-years', is_exoplanet: true }
];

export const MOONS = [
  { id: 'moon', name: 'The Moon (Luna)', description: "Earth's only natural satellite, responsible for our ocean tides.", color: '#d1d5db', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg', diameter: '3,474 km', parent_planet: 'Earth' },
  { id: 'europa', name: 'Europa', description: 'A Galilean moon of Jupiter with a subsurface ocean of liquid water beneath a crust of ice.', color: '#93c5fd', image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Europa-moon.jpg', diameter: '3,121 km', parent_planet: 'Jupiter' },
  { id: 'titan', name: 'Titan', description: 'The largest moon of Saturn, known for its dense atmosphere and liquid methane lakes.', color: '#fb923c', image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Titan_in_true_color.jpg', diameter: '5,149 km', parent_planet: 'Saturn' },
  { id: 'io', name: 'Io', description: 'The most geologically active object in the Solar System, home to hundreds of volcanoes.', color: '#fef08a', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Io_highest_resolution_true_color.jpg', diameter: '3,642 km', parent_planet: 'Jupiter' },
  { id: 'enceladus', name: 'Enceladus', description: 'A small icy moon of Saturn that sprays water-ice geysers from its south pole.', color: '#e0f2fe', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Enceladus_stripes_PIA11686.jpg', diameter: '504 km', parent_planet: 'Saturn' },
  { id: 'triton', name: 'Triton', description: 'Neptune\'s largest moon, which orbits in a retrograde direction opposite to its planet\'s rotation.', color: '#fed7aa', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg', diameter: '2,706 km', parent_planet: 'Neptune' }
];

export async function fetchTable(table, orderBy = 'created_at') {
  const { data, error } = await supabaseServer
    .from(table)
    .select('*')
    .order(orderBy, { ascending: true });
  if (error) console.error(`[CosmoAPI] fetch ${table} error:`, error);
  return { data: data || [], error };
}

export async function fetchById(table, id) {
  // 1. Check static data (Exoplanets/Moons) - Kept as fallback for now
  if (table === 'planets') {
    const exo = EXOPLANETS.find(e => e.id === id || e.name.toLowerCase() === id.toLowerCase());
    if (exo) return { data: exo, error: null };
  }
  if (table === 'moons') {
    const moon = MOONS.find(m => m.id === id || m.name.toLowerCase() === id.toLowerCase());
    if (moon) return { data: moon, error: null };
  }

  // 2. Try fetching by ID (UUID/Primary Key)
  let { data, error } = await supabaseServer
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  // 3. Fallback: If not found, try fetching by Name (Slug)
  if (!data) {
    const { data: nameData, error: nameError } = await supabaseServer
      .from(table)
      .select('*')
      .ilike('name', id)
      .maybeSingle();
    
    if (nameData) return { data: nameData, error: null };
    
    // If both fail, log the original error
    if (error) console.error(`[CosmoAPI] fetch ${table}/${id} error:`, error);
    return { data: null, error: error || nameError };
  }

  return { data, error };
}

export async function fetchAllCelestialObjects() {
  const tables = ['planets', 'stars', 'galaxies', 'asteroids'];
  const results = await Promise.all(tables.map(t => fetchTable(t)));
  const allObjects = [];
  results.forEach((res, idx) => {
     if (res.data) {
       allObjects.push(...res.data.map(obj => ({ ...obj, categoryId: tables[idx] })));
     }
  });
  return allObjects;
}

export async function fetchRelatedItems(sourceTable, sourceId) {
  const { data: refs, error } = await supabaseServer
    .from('cross_references')
    .select('*')
    .eq('source_table', sourceTable)
    .eq('source_id', sourceId);

  if (error || !refs || refs.length === 0) return { data: [], error };

  const grouped = {};
  refs.forEach((ref) => {
    if (!grouped[ref.target_table]) grouped[ref.target_table] = [];
    grouped[ref.target_table].push(ref);
  });

  const results = [];
  for (const [table, tableRefs] of Object.entries(grouped)) {
    if (!VALID_TABLES.includes(table)) continue;
    const ids = tableRefs.map((r) => r.target_id);
    const { data: items } = await supabaseServer
      .from(table)
      .select('id, name, image, description')
      .in('id', ids);

    if (items) {
      items.forEach((item) => {
        const ref = tableRefs.find((r) => r.target_id === item.id);
        results.push({ ...item, table, relation_type: ref?.relation_type || 'related' });
      });
    }
  }
  return { data: results, error: null };
}

export async function fetchPlanets() { 
  const res = await fetchTable('planets');
  if (res.data) {
    const order = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    res.data.sort((a, b) => {
      const idxA = order.indexOf(a.name.toLowerCase());
      const idxB = order.indexOf(b.name.toLowerCase());
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }
  return res;
}
export async function fetchStars() { return fetchTable('stars'); }
export async function fetchGalaxies() { return fetchTable('galaxies'); }
export async function fetchAsteroids() { return fetchTable('asteroids'); }
export async function fetchMissions() { return fetchTable('missions'); }
export async function fetchSpacePhenomena() { return fetchTable('space_phenomena'); }
