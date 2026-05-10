// CosmoData API — Server-side data functions
// Used in Server Components and API Routes

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseServer } from './supabaseServer';

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

const OPEN_NOTIFY_CREW_URLS = [
  'https://api.open-notify.org/astros.json',
  'http://api.open-notify.org/astros.json',
];

async function fetchOpenNotifyCrew() {
  let lastError = null;

  for (const url of OPEN_NOTIFY_CREW_URLS) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        lastError = new Error(`Open Notify returned ${res.status} for ${url}`);
        continue;
      }

      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Open Notify crew feed unavailable');
}

const VALID_TABLES = ['planets', 'stars', 'galaxies', 'asteroids', 'missions', 'space_phenomena', 'satellites'];

function isMissingSupabaseTableError(error) {
  return error?.code === 'PGRST205' || (typeof error?.message === 'string' && error.message.includes('Could not find the table'));
}

export const EXOPLANETS = [
  { id: 'proxima-b', name: 'Proxima Centauri b', description: 'An exoplanet orbiting within the habitable zone of the red dwarf star Proxima Centauri.', color: '#ef4444', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Proxima_Centauri_b_ESO.jpg', diameter: '1.1 Earths', distance_from_sun: '4.24 light-years', is_exoplanet: true },
  { id: 'trappist-1e', name: 'TRAPPIST-1e', description: 'A solid, rocky, terrestrial exoplanet orbiting within the habitable zone of the ultra-cool dwarf star TRAPPIST-1.', color: '#d97706', image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/TRAPPIST-1e_artist_impression.jpg', diameter: '0.92 Earths', distance_from_sun: '39.6 light-years', is_exoplanet: true },
  { id: 'kepler-452b', name: 'Kepler-452b', description: 'A super-Earth exoplanet orbiting within the inner edge of the habitable zone of the sun-like star Kepler-452.', color: '#10b981', image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Kepler-452b_artist_concept.jpg', diameter: '1.6 Earths', distance_from_sun: '1,402 light-years', is_exoplanet: true },
  { id: '51-peg-b', name: '51 Pegasi b', description: 'The first exoplanet discovered orbiting a main-sequence star. It is a hot Jupiter.', color: '#8b5cf6', image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Exoplanet_Comparison_51_Pegasi_b.png', diameter: '1.9 Jupiters', distance_from_sun: '50.45 light-years', is_exoplanet: true }
];

export const MOONS = [
  {
    id: 'moon',
    name: 'The Moon (Luna)',
    description: "Earth's only natural satellite and the main driver of our ocean tides.",
    color: '#d1d5db',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg',
    diameter: '3,474.8 km',
    parent_planet: 'Earth',
    mass: '7.35 x 10^22 kg',
    gravity: '1.62 m/s^2',
    orbital_period: '27.32 days',
    rotation_period: '27.32 days',
    temperature: '-20 C avg',
    atmosphere_label: 'Extremely thin exosphere',
    facts: ['Tidally locked to Earth', 'Causes ocean tides', 'Ancient basalt plains', 'Likely formed after a giant impact']
  },
  {
    id: 'europa',
    name: 'Europa',
    description: 'A Galilean moon of Jupiter with a global subsurface ocean beneath an icy crust.',
    color: '#93c5fd',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Europa-moon.jpg',
    diameter: '3,121.6 km',
    parent_planet: 'Jupiter',
    mass: '4.80 x 10^22 kg',
    gravity: '1.31 m/s^2',
    orbital_period: '3.55 days',
    rotation_period: '3.55 days',
    temperature: '-160 C avg',
    atmosphere_label: 'Very thin oxygen atmosphere',
    facts: ['Likely ocean world', 'Surface crossed by ice fractures', 'Tidally heated interior', 'Prime target for life-detection missions']
  },
  {
    id: 'titan',
    name: 'Titan',
    description: 'Saturns largest moon, famous for its dense atmosphere and lakes of liquid methane and ethane.',
    color: '#fb923c',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Titan_in_true_color.jpg',
    diameter: '5,149.5 km',
    parent_planet: 'Saturn',
    mass: '1.35 x 10^23 kg',
    gravity: '1.35 m/s^2',
    orbital_period: '15.95 days',
    rotation_period: '15.95 days',
    temperature: '-179 C avg',
    atmosphere_label: 'Dense nitrogen-rich atmosphere',
    facts: ['Largest moon of Saturn', 'Stable surface lakes', 'Thick orange haze', 'Target of NASAs Dragonfly mission']
  },
  {
    id: 'io',
    name: 'Io',
    description: 'The most volcanically active world in the Solar System, driven by intense tidal heating from Jupiter.',
    color: '#fef08a',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Io_highest_resolution_true_color.jpg',
    diameter: '3,643.2 km',
    parent_planet: 'Jupiter',
    mass: '8.93 x 10^22 kg',
    gravity: '1.80 m/s^2',
    orbital_period: '1.77 days',
    rotation_period: '1.77 days',
    temperature: '-130 C avg',
    atmosphere_label: 'Thin sulfur dioxide atmosphere',
    facts: ['Hundreds of active volcanoes', 'Constant resurfacing', 'Strong tidal heating', 'Colorful sulfur-rich terrain']
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    description: 'A small icy moon of Saturn that vents water-rich plumes from fractures near its south pole.',
    color: '#e0f2fe',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Enceladus_stripes_PIA11686.jpg',
    diameter: '504.2 km',
    parent_planet: 'Saturn',
    mass: '1.08 x 10^20 kg',
    gravity: '0.11 m/s^2',
    orbital_period: '1.37 days',
    rotation_period: '1.37 days',
    temperature: '-201 C avg',
    atmosphere_label: 'Localized water vapor plume atmosphere',
    facts: ['Reflects most incoming sunlight', 'Global ocean likely present', 'South polar geysers', 'Key astrobiology target']
  },
  {
    id: 'triton',
    name: 'Triton',
    description: "Neptunes largest moon, orbiting in a retrograde direction that suggests it was captured.",
    color: '#fed7aa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg',
    diameter: '2,706.8 km',
    parent_planet: 'Neptune',
    mass: '2.14 x 10^22 kg',
    gravity: '0.78 m/s^2',
    orbital_period: '5.88 days',
    rotation_period: '5.88 days',
    temperature: '-235 C avg',
    atmosphere_label: 'Thin nitrogen atmosphere',
    facts: ['Retrograde orbit', 'Likely captured Kuiper Belt object', 'Nitrogen frost surface', 'Active cryovolcanic history']
  }
];

export const SATELLITES = [
  {
    id: 'iss',
    name: 'International Space Station',
    description: 'A permanently crewed orbital laboratory circling Earth in low Earth orbit.',
    color: '#60a5fa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station_after_undocking_of_STS-132.jpg',
    operator: 'NASA / Roscosmos / ESA / JAXA / CSA',
    mission_type: 'Crewed Research Station',
    orbit_type: 'Low Earth Orbit',
    altitude: 'Approximately 400 km',
    velocity: '7.66 km/s',
    launch_date: 'November 20, 1998',
    status: 'Active',
    mass: 'Approximately 419,725 kg',
    power: '84 to 120 kW solar power',
    orbital_period: 'About 93 minutes',
    inclination: '51.6 degrees',
    dimensions: '108.5 m end to end',
    facts: [
      'Hosts long-duration astronaut crews in microgravity',
      'Supports biology, physics, and Earth observation research',
      'Assembled from multiple pressurized modules and truss elements',
      'Completes about 16 orbits of Earth each day'
    ],
    main_parts: [
      { name: 'Pressurized Modules', function: 'Living quarters, labs, and docking volumes for crew and experiments.' },
      { name: 'Integrated Truss', function: 'Backbone carrying radiators, power channels, and support hardware.' },
      { name: 'Solar Arrays', function: 'Generate electrical power for station systems.' },
      { name: 'Robotic Systems', function: 'Move cargo, support maintenance, and assist visiting vehicle operations.' }
    ]
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    description: 'A flagship observatory in low Earth orbit delivering high-resolution imagery across multiple wavelengths.',
    color: '#a78bfa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
    operator: 'NASA / ESA',
    mission_type: 'Space Observatory',
    orbit_type: 'Low Earth Orbit',
    altitude: 'About 540 km',
    velocity: '7.5 km/s',
    launch_date: 'April 24, 1990',
    status: 'Active',
    mass: 'About 11,110 kg',
    power: 'About 2,800 W',
    orbital_period: 'About 95 minutes',
    inclination: '28.5 degrees',
    dimensions: '13.2 m long, 4.2 m diameter',
    facts: [
      'Observes in ultraviolet, visible, and near-infrared wavelengths',
      'Enabled deep-field views that transformed cosmology',
      'Was serviced by multiple Space Shuttle missions',
      'Still operating decades after launch'
    ],
    main_parts: [
      { name: '2.4 m Primary Mirror', function: 'Collects and focuses incoming light.' },
      { name: 'Scientific Instruments', function: 'Capture images and spectra across multiple bands.' },
      { name: 'Fine Guidance Sensors', function: 'Keep the observatory pointed with high precision.' },
      { name: 'Solar Arrays', function: 'Provide electrical power for telescope operations.' }
    ]
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    description: 'An infrared observatory operating around Sun-Earth L2 for deep-space astronomy.',
    color: '#f59e0b',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/JWST_spacecraft_model_2.png',
    operator: 'NASA / ESA / CSA',
    mission_type: 'Infrared Space Observatory',
    orbit_type: 'Halo Orbit around Sun-Earth L2',
    altitude: 'About 1.5 million km from Earth',
    velocity: 'About 0.4 km/s around L2 environment',
    launch_date: 'December 25, 2021',
    status: 'Active',
    mass: 'About 6,500 kg',
    power: 'About 2,000 W',
    orbital_period: 'About 6 months around L2 halo path',
    inclination: 'Operational halo trajectory',
    dimensions: '21.2 m by 14.2 m deployed',
    facts: [
      'Optimized for infrared astronomy',
      'Uses a five-layer sunshield for passive cooling',
      'Studies early galaxies, exoplanets, and star formation',
      'Operates far beyond low Earth orbit'
    ],
    main_parts: [
      { name: 'Segmented Primary Mirror', function: 'Large gold-coated mirror gathers faint infrared light.' },
      { name: 'Sunshield', function: 'Blocks heat from the Sun, Earth, and Moon.' },
      { name: 'Science Instruments', function: 'Imaging and spectroscopy across infrared wavelengths.' },
      { name: 'Spacecraft Bus', function: 'Handles communications, propulsion, and attitude control.' }
    ]
  },
  {
    id: 'landsat-8',
    name: 'Landsat 8',
    description: 'An Earth-observing satellite collecting multispectral imagery for land and water monitoring.',
    color: '#22c55e',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Landsat_Data_Continuity_Mission.jpg',
    operator: 'NASA / USGS',
    mission_type: 'Earth Observation',
    orbit_type: 'Sun-Synchronous Orbit',
    altitude: '705 km',
    velocity: '7.5 km/s',
    launch_date: 'February 11, 2013',
    status: 'Active',
    mass: 'About 2,623 kg at launch',
    power: 'About 1,550 W',
    orbital_period: '99 minutes',
    inclination: '98.2 degrees',
    dimensions: 'About 3 m by 3 m bus with deployed solar array',
    facts: [
      'Provides medium-resolution land imaging',
      'Continues the long-running Landsat record',
      'Images Earth in visible, infrared, and thermal bands',
      'Supports agriculture, water, and disaster analysis'
    ],
    main_parts: [
      { name: 'OLI', function: 'Operational Land Imager collects visible to shortwave infrared data.' },
      { name: 'TIRS', function: 'Thermal Infrared Sensor measures land-surface temperature.' },
      { name: 'Spacecraft Bus', function: 'Supports power, data handling, and communications.' },
      { name: 'Solar Array', function: 'Supplies spacecraft electrical power.' }
    ]
  },
  {
    id: 'terra',
    name: 'Terra',
    description: 'A long-running Earth system science satellite measuring the atmosphere, land, and energy balance.',
    color: '#06b6d4',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Terra_satellite_model_1.png',
    operator: 'NASA',
    mission_type: 'Earth System Science',
    orbit_type: 'Sun-Synchronous Orbit',
    altitude: '705 km',
    velocity: '7.5 km/s',
    launch_date: 'December 18, 1999',
    status: 'Active',
    mass: 'About 5,190 kg',
    power: 'About 2,530 W',
    orbital_period: '99 minutes',
    inclination: '98.2 degrees',
    dimensions: '6.8 m by 3.5 m by 3.5 m',
    facts: [
      'Part of NASAs Earth Observing System',
      'Measures clouds, aerosols, land cover, and radiation',
      'Carries multiple major Earth science instruments',
      'Supports long-term climate records'
    ],
    main_parts: [
      { name: 'MODIS', function: 'Global imaging for clouds, oceans, and land processes.' },
      { name: 'ASTER', function: 'High-resolution imaging of Earths surface.' },
      { name: 'CERES', function: 'Measures Earth radiation budget.' },
      { name: 'MISR', function: 'Multi-angle imaging of aerosols and clouds.' }
    ]
  },
  {
    id: 'aqua',
    name: 'Aqua',
    description: 'An Earth-observing satellite focused on the water cycle, atmosphere, and climate processes.',
    color: '#38bdf8',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Aqua_%28satellite%29.jpg',
    operator: 'NASA',
    mission_type: 'Earth System Science',
    orbit_type: 'Sun-Synchronous Orbit',
    altitude: '705 km',
    velocity: '7.5 km/s',
    launch_date: 'May 4, 2002',
    status: 'Active',
    mass: 'About 2,934 kg',
    power: 'About 4,444 W',
    orbital_period: '99 minutes',
    inclination: '98.2 degrees',
    dimensions: 'About 4.8 m by 16.7 m with solar array deployed',
    facts: [
      'Tracks water vapor, clouds, precipitation, and sea surface temperature',
      'Works as part of the A-Train constellation heritage',
      'Supports weather and climate science',
      'Carries six Earth-observing instruments'
    ],
    main_parts: [
      { name: 'AIRS', function: 'Infrared sounder for temperature and humidity profiles.' },
      { name: 'AMSR-E Heritage', function: 'Microwave observations of water-related processes.' },
      { name: 'MODIS', function: 'Global imaging for land, ocean, and atmosphere.' },
      { name: 'CERES', function: 'Measures Earth radiation budget.' }
    ]
  },
  {
    id: 'noaa-20',
    name: 'NOAA-20',
    description: 'A polar-orbiting weather satellite delivering operational environmental data for forecasting and climate products.',
    color: '#f97316',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/JPSS-1_in_orbit.jpg',
    operator: 'NOAA / NASA',
    mission_type: 'Operational Weather Observation',
    orbit_type: 'Sun-Synchronous Polar Orbit',
    altitude: '824 km',
    velocity: '7.4 km/s',
    launch_date: 'November 18, 2017',
    status: 'Active',
    mass: 'About 2,540 kg',
    power: 'About 1,936 W',
    orbital_period: '101 minutes',
    inclination: '98.7 degrees',
    dimensions: 'About 3.0 m by 1.0 m by 1.0 m bus class',
    facts: [
      'Delivers operational data for weather forecasting',
      'Part of the Joint Polar Satellite System',
      'Flies in afternoon polar orbit',
      'Supports storm tracking, sea ice, fires, and atmospheric sounding'
    ],
    main_parts: [
      { name: 'VIIRS', function: 'Visible and infrared imaging for clouds, land, and oceans.' },
      { name: 'CrIS', function: 'Hyperspectral infrared sounder for atmospheric profiles.' },
      { name: 'ATMS', function: 'Microwave sounding through clouds and precipitation.' },
      { name: 'OMPS', function: 'Ozone mapping and profiling.' }
    ]
  },
  {
    id: 'goes-16',
    name: 'GOES-16',
    description: 'A geostationary weather satellite providing rapid imagery and environmental monitoring for the Western Hemisphere.',
    color: '#ec4899',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/10/GOES-R_Spacecraft.jpg',
    operator: 'NOAA / NASA',
    mission_type: 'Geostationary Weather Observation',
    orbit_type: 'Geostationary Orbit',
    altitude: '35,786 km',
    velocity: '3.07 km/s',
    launch_date: 'November 19, 2016',
    status: 'Active',
    mass: 'About 5,192 kg',
    power: 'About 4,900 W',
    orbital_period: '24 hours',
    inclination: 'Near-equatorial geostationary',
    dimensions: 'About 6.1 m by 2.5 m by 3.9 m stowed',
    facts: [
      'Provides full-disk and rapid-scan Earth imagery',
      'Tracks storms, lightning, and space weather',
      'Part of the GOES-R Series',
      'Supports forecasting across the Americas and Atlantic'
    ],
    main_parts: [
      { name: 'ABI', function: 'Advanced Baseline Imager for high-frequency weather imagery.' },
      { name: 'GLM', function: 'Geostationary Lightning Mapper detects total lightning.' },
      { name: 'SUVI', function: 'Solar ultraviolet imaging for space weather monitoring.' },
      { name: 'EXIS', function: 'Measures solar X-ray and extreme ultraviolet output.' }
    ]
  }
];

export async function fetchTable(table, orderBy = 'created_at', options = {}) {
  const { logErrors = true } = options;
  const { data, error } = await supabaseServer
    .from(table)
    .select('*')
    .order(orderBy, { ascending: true });
  if (error && logErrors) console.error(`[CosmoAPI] fetch ${table} error:`, error);
  return { data: data || [], error };
}

export async function fetchById(table, id) {
  if (table === 'planets') {
    const exo = EXOPLANETS.find(e => e.id === id || e.name.toLowerCase() === id.toLowerCase());
    if (exo) return { data: exo, error: null };
  }
  if (table === 'moons') {
    const moon = MOONS.find(m => m.id === id || m.name.toLowerCase() === id.toLowerCase());
    if (moon) return { data: moon, error: null };
  }
  if (table === 'satellites') {
    const { data: liveSatellite, error: liveSatelliteError } = await supabaseServer
      .from('satellites')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (liveSatellite) return { data: liveSatellite, error: null };

    const { data: liveSatelliteByName, error: liveSatelliteByNameError } = await supabaseServer
      .from('satellites')
      .select('*')
      .ilike('name', id)
      .maybeSingle();

    if (liveSatelliteByName) return { data: liveSatelliteByName, error: null };

    const satellite = SATELLITES.find(s => s.id === id || s.name.toLowerCase() === id.toLowerCase());
    if (satellite) return { data: satellite, error: null };

    const liveError = liveSatelliteError || liveSatelliteByNameError;
    if (liveError && !isMissingSupabaseTableError(liveError)) {
      console.error(`[CosmoAPI] fetch ${table}/${id} error:`, liveError);
    }
    return { data: null, error: liveError };
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
  const results = await Promise.all([
    fetchTable('planets'),
    fetchTable('stars'),
    fetchTable('galaxies'),
    fetchTable('asteroids'),
    fetchSatellites(),
  ]);
  const tables = ['planets', 'stars', 'galaxies', 'asteroids', 'satellites'];
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
export async function fetchMoons() { return { data: MOONS, error: null }; }
export async function fetchSatellites() {
  const res = await fetchTable('satellites', 'created_at', { logErrors: false });
  if (res.error || !res.data?.length) return { data: SATELLITES, error: null };
  return res;
}
export async function fetchMissions() { return fetchTable('missions'); }
export async function fetchSpacePhenomena() { return fetchTable('space_phenomena'); }

export async function fetchISSInfo() {
  const fallbackIssData = {
    id: 1,
    built_date: 'November 20, 1998',
    participating_countries: 15,
    construction_details: 'Assembled in low Earth orbit over 136 consecutive space flights using both the US Space Shuttle and Russian Proton/Soyuz rockets. It began with the Zarya module in 1998 and has been continuously occupied since November 2000.',
    crew_stay_duration: 'Standard expeditions last roughly 6 months (180 days). However, extended scientific missions studying the long-term effects of microgravity on the human body can last over a full year (e.g., Frank Rubio/Scott Kelly).',
    modules: [
      {"name": "Zarya", "type": "Functional Cargo Block", "agency": "Roscosmos (Russia)", "purpose": "Original power & propulsion."},
      {"name": "Unity (Node 1)", "type": "Connecting Node", "agency": "NASA (USA)", "purpose": "First US segment, connecting nodes."},
      {"name": "Zvezda", "type": "Service Module", "agency": "Roscosmos (Russia)", "purpose": "Life support systems."},
      {"name": "Destiny", "type": "Laboratory Module", "agency": "NASA (USA)", "purpose": "Primary US research facility."},
      {"name": "Columbus", "type": "Science Laboratory", "agency": "ESA (Europe)", "purpose": "Multidisciplinary scientific lab."},
      {"name": "Kibo", "type": "Experiment Module", "agency": "JAXA (Japan)", "purpose": "Largest single module, specialized experiments."},
      {"name": "Cupola", "type": "Observatory", "agency": "ESA/NASA", "purpose": "7-window module for robotic ops and Earth watching."}
    ],
    astronauts: [] // Will be populated dynamically
  };

  try {
    // 1. Automatically fetch the live crew from Open-Notify API
    let liveAstronauts = [];
    try {
      const astroData = await fetchOpenNotifyCrew();
      const issCrewLive = astroData.people.filter(p => p.craft === 'ISS');

      // Dictionary to append photos and roles for known currently active people
      const KNOWN_ASTRONAUTS = {
        "Oleg Kononenko": { photo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Oleg_Kononenko_%28expedition_69%29.jpg", agency: "Roscosmos", role: "Commander" },
        "Nikolai Chub": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nikolai_Chub_in_2022.jpg", agency: "Roscosmos", role: "Flight Engineer" },
        "Tracy Caldwell Dyson": { photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Tracy_Caldwell_Dyson_official_portrait_2023.jpg", agency: "NASA", role: "Flight Engineer" },
        "Matthew Dominick": { photo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Matthew_Dominick_NASA_Astronaut_%28cropped%29.jpg", agency: "NASA", role: "Flight Engineer" },
        "Michael Barratt": { photo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Michael_R._Barratt.jpg", agency: "NASA", role: "Flight Engineer" },
        "Jeanette Epps": { photo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Jeanette_J._Epps_official_portrait_in_an_EMU_spacesuit_%282023%29.jpg", agency: "NASA", role: "Flight Engineer" },
        "Alexander Grebenkin": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Alexander_Grebenkin_Expedition_71.jpg", agency: "Roscosmos", role: "Flight Engineer" },
        "Butch Wilmore": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Barry_E._Wilmore_portrait.jpg", agency: "NASA", role: "Commander (Starliner)" },
        "Sunita Williams": { photo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sunita_Williams_Official_Portrait_2_cropped.jpg", agency: "NASA", role: "Pilot (Starliner)" }
      };

      liveAstronauts = issCrewLive.map(astro => {
        const knownData = KNOWN_ASTRONAUTS[astro.name] || {};
        return {
          name: astro.name,
          agency: knownData.agency || "Space Agency",
          role: knownData.role || "Expedition Crew",
          photo: knownData.photo || null
        };
      });
    } catch (apiErr) {
      console.log('[CosmoAPI] Open-Notify live fetch warning:', apiErr.message);
    }

    // 2. Fetch the current existing context from Supabase table if it exists
    const issClient = supabaseAdmin || supabaseServer;
    const { data: dbData } = await issClient
      .from('iss_info')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    // 3. Merge live Open-Notify info with fallback/db structure
    const finalData = dbData || fallbackIssData;
    if (liveAstronauts.length > 0) {
      finalData.astronauts = liveAstronauts;
    }

    // 4. Silently sync the newly assembled live data back into Supabase for storage
    // (If the table doesn't exist yet, it safely ignores the sql error and just returns the live assembled object)
    if (liveAstronauts.length > 0 && supabaseAdmin) {
      const { error: syncError } = await supabaseAdmin.from('iss_info').upsert({ id: 1, ...finalData });
      if (syncError) {
        console.warn('[CosmoAPI] ISS info sync warning:', syncError.message);
      }
    } else if (liveAstronauts.length > 0) {
      console.warn('[CosmoAPI] SUPABASE_SERVICE_ROLE_KEY missing; skipping iss_info sync.');
    }

    return { data: finalData, error: null };
  } catch {
    return { data: fallbackIssData, error: null };
  }
}

