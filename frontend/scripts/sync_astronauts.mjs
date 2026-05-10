import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || '';
        val = val.replace(/^['"]|['"]$/g, '').trim();
        process.env[match[1]] = val;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('The sync requires the service role key because RLS blocks anon writes.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const BASE_URL = 'https://ll.thespacedevs.com/2.2.0/astronaut/';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SUPPLEMENTAL_ASTRONAUTS = [
  {
    spacedevs_id: -1001,
    name: 'Yuri Gagarin',
    status: { name: 'Deceased' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 34,
    date_of_birth: '1934-03-09',
    date_of_death: '1968-03-27',
    nationality: 'USSR',
    bio: 'First human in space and the first to orbit Earth.',
    agency: { name: 'Soviet Space Program', abbrev: 'USSR' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Yuri_Gagarin_in_Sweden.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Yuri_Gagarin_in_Sweden.jpg',
    flights_count: 1,
    landings_count: 1,
    spacewalks_count: 0,
    first_flight: '1961-04-12T00:00:00Z',
    last_flight: '1961-04-12T00:00:00Z',
  },
  {
    spacedevs_id: -1002,
    name: 'Valentina Tereshkova',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 88,
    date_of_birth: '1937-03-06',
    nationality: 'Russia',
    bio: 'First and youngest woman to fly in space.',
    agency: { name: 'Roscosmos', abbrev: 'Roscosmos' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Valentina_Tereshkova_1969.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Valentina_Tereshkova_1969.jpg',
    flights_count: 1,
    landings_count: 1,
    spacewalks_count: 0,
    first_flight: '1963-06-16T00:00:00Z',
    last_flight: '1963-06-16T00:00:00Z',
  },
  {
    spacedevs_id: -1003,
    name: 'Neil Armstrong',
    status: { name: 'Deceased' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 82,
    date_of_birth: '1930-08-05',
    date_of_death: '2012-08-25',
    nationality: 'USA',
    bio: 'First human to walk on the Moon.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Neil_Armstrong_pose.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Neil_Armstrong_pose.jpg',
    flights_count: 2,
    landings_count: 2,
    spacewalks_count: 0,
    first_flight: '1966-03-16T00:00:00Z',
    last_flight: '1969-07-16T00:00:00Z',
  },
  {
    spacedevs_id: -1004,
    name: 'Buzz Aldrin',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 95,
    date_of_birth: '1930-01-20',
    nationality: 'USA',
    bio: 'Lunar module pilot of Apollo 11 and the second human on the Moon.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Buzz_Aldrin.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Buzz_Aldrin.jpg',
    flights_count: 2,
    landings_count: 2,
    spacewalks_count: 1,
    first_flight: '1966-03-16T00:00:00Z',
    last_flight: '1969-07-16T00:00:00Z',
  },
  {
    spacedevs_id: -1005,
    name: 'Sally Ride',
    status: { name: 'Deceased' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 61,
    date_of_birth: '1951-05-26',
    date_of_death: '2012-07-23',
    nationality: 'USA',
    bio: 'First American woman in space.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Sally_Ride.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Sally_Ride.jpg',
    flights_count: 2,
    landings_count: 2,
    spacewalks_count: 0,
    first_flight: '1983-06-18T00:00:00Z',
    last_flight: '1984-10-05T00:00:00Z',
  },
  {
    spacedevs_id: -1006,
    name: 'John Glenn',
    status: { name: 'Deceased' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 95,
    date_of_birth: '1921-07-18',
    date_of_death: '2016-12-08',
    nationality: 'USA',
    bio: 'First American to orbit Earth and later a U.S. senator.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/John_Glenn_1964.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/John_Glenn_1964.jpg',
    flights_count: 2,
    landings_count: 2,
    spacewalks_count: 0,
    first_flight: '1962-02-20T00:00:00Z',
    last_flight: '1998-10-29T00:00:00Z',
  },
  {
    spacedevs_id: -1007,
    name: 'Mae Jemison',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 69,
    date_of_birth: '1956-10-17',
    nationality: 'USA',
    bio: 'First African American woman to travel in space.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Mae_Jemison_by_Gage_Skidmore.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Mae_Jemison_by_Gage_Skidmore.jpg',
    flights_count: 1,
    landings_count: 1,
    spacewalks_count: 0,
    first_flight: '1992-09-12T00:00:00Z',
    last_flight: '1992-09-20T00:00:00Z',
  },
  {
    spacedevs_id: -1008,
    name: 'Chris Hadfield',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 66,
    date_of_birth: '1959-08-29',
    nationality: 'Canada',
    bio: 'Canadian astronaut, former ISS commander, and ISS social media pioneer.',
    agency: { name: 'Canadian Space Agency', abbrev: 'CSA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Chris_Hadfield_at_San_Diego_Comic_Con_2013.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Chris_Hadfield_at_San_Diego_Comic_Con_2013.jpg',
    flights_count: 3,
    landings_count: 3,
    spacewalks_count: 2,
    first_flight: '1995-11-12T00:00:00Z',
    last_flight: '2013-12-19T00:00:00Z',
  },
  {
    spacedevs_id: -1009,
    name: 'Scott Kelly',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 72,
    date_of_birth: '1964-02-21',
    nationality: 'USA',
    bio: 'Commander of the Year in Space mission and longtime ISS crewmember.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Scott_Kelly_in_2014.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Scott_Kelly_in_2014.jpg',
    flights_count: 4,
    landings_count: 4,
    spacewalks_count: 4,
    first_flight: '1999-12-19T00:00:00Z',
    last_flight: '2015-03-27T00:00:00Z',
  },
  {
    spacedevs_id: -1010,
    name: 'Ellen Ochoa',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 67,
    date_of_birth: '1958-05-10',
    nationality: 'USA',
    bio: 'First Hispanic woman in space and former Johnson Space Center director.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ellen_Ochoa.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ellen_Ochoa.jpg',
    flights_count: 4,
    landings_count: 4,
    spacewalks_count: 0,
    first_flight: '1993-04-08T00:00:00Z',
    last_flight: '2002-04-08T00:00:00Z',
  },
  {
    spacedevs_id: -1011,
    name: 'Guion Bluford',
    status: { name: 'Retired' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 83,
    date_of_birth: '1942-11-22',
    nationality: 'USA',
    bio: 'First African American astronaut to fly in space.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Guion_Bluford_-_1983.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Guion_Bluford_-_1983.jpg',
    flights_count: 4,
    landings_count: 4,
    spacewalks_count: 0,
    first_flight: '1983-08-30T00:00:00Z',
    last_flight: '1992-03-24T00:00:00Z',
  },
  {
    spacedevs_id: -1012,
    name: 'Michael Collins',
    status: { name: 'Deceased' },
    type: { name: 'Astronaut' },
    in_space: false,
    age: 90,
    date_of_birth: '1930-10-31',
    date_of_death: '2021-04-28',
    nationality: 'USA',
    bio: 'Command module pilot of Apollo 11 and a key figure in lunar history.',
    agency: { name: 'NASA', abbrev: 'NASA' },
    profile_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Michael_Collins_1966.jpg',
    profile_image_thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Michael_Collins_1966.jpg',
    flights_count: 2,
    landings_count: 2,
    spacewalks_count: 1,
    first_flight: '1966-03-16T00:00:00Z',
    last_flight: '1969-07-16T00:00:00Z',
  },
];

function normalizeSupplementalAstronaut(astro) {
  return {
    ...astro,
    updated_at: new Date().toISOString(),
  };
}

const mapAstronaut = (astro) => {
  return {
    spacedevs_id: astro.id,
    name: astro.name || null,
    status: astro.status || null,
    type: astro.type || null,
    in_space: !!astro.in_space,
    time_in_space: astro.time_in_space || null,
    eva_time: astro.eva_time || null,
    age: astro.age ?? null,
    date_of_birth: astro.date_of_birth || null,
    date_of_death: astro.date_of_death || null,
    nationality: astro.nationality || null,
    bio: astro.bio || null,
    twitter: astro.twitter || null,
    instagram: astro.instagram || null,
    wiki: astro.wiki || null,
    agency: astro.agency || null,
    profile_image: astro.profile_image || null,
    profile_image_thumbnail: astro.profile_image_thumbnail || null,
    flights_count: astro.flights_count ?? 0,
    landings_count: astro.landings_count ?? 0,
    spacewalks_count: astro.spacewalks_count ?? 0,
    last_flight: astro.last_flight || null,
    first_flight: astro.first_flight || null,
    updated_at: new Date().toISOString()
  };
};

async function syncAstronauts() {
  console.log('Fetching astronaut records from SpaceDevs...');

  let url = `${BASE_URL}?limit=200&ordering=first_flight`;
  let total = 0;
  let page = 1;

  while (url) {
    console.log(`Page ${page}: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`SpaceDevs API error: ${res.status}`);
      break;
    }

    const data = await res.json();
    const rows = (data.results || []).map(mapAstronaut);

    if (rows.length > 0) {
      const { error } = await supabase
        .from('astronauts')
        .upsert(rows, { onConflict: 'spacedevs_id' });

      if (error) {
        console.error('Supabase upsert error:', error.message);
        process.exit(1);
      }

      total += rows.length;
      console.log(`Synced ${rows.length} records. Total so far: ${total}.`);
    }

    url = data.next;
    page += 1;
    if (url) await delay(350);
  }

  if (SUPPLEMENTAL_ASTRONAUTS.length > 0) {
    const supplementalRows = SUPPLEMENTAL_ASTRONAUTS.map(normalizeSupplementalAstronaut);
    const { error: supplementalError } = await supabase
      .from('astronauts')
      .upsert(supplementalRows, { onConflict: 'spacedevs_id' });

    if (supplementalError) {
      console.warn('Supplemental astronaut sync warning:', supplementalError.message);
    } else {
      console.log(`Synced ${supplementalRows.length} supplemental historical astronaut records.`);
    }
  }

  const { count, error: countError } = await supabase
    .from('astronauts')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.warn('Could not verify row count:', countError.message);
  } else {
    console.log(`Supabase now contains ${count} astronaut records.`);
  }

  console.log(`Sync complete. Total astronauts synced: ${total}.`);
}

syncAstronauts().catch((error) => {
  console.error('Fatal sync error:', error);
  process.exit(1);
});
