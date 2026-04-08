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
