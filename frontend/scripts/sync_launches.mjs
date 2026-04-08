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

const UPCOMING_URL = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/';
const PAST_URL = 'https://ll.thespacedevs.com/2.2.0/launch/previous/';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mapLaunch = (launch) => {
  return {
    id: launch.id,
    name: launch.name || null,
    status: launch.status || null,
    net: launch.net || null,
    window_start: launch.window_start || null,
    window_end: launch.window_end || null,
    launch_service_provider: launch.launch_service_provider || null,
    rocket: launch.rocket || null,
    mission: launch.mission || null,
    pad: launch.pad || null,
    image: launch.image || null,
    infographic: launch.infographic || null,
    webcast_live: launch.webcast_live ?? null,
    probability: launch.probability ?? null,
    program: launch.program || null,
    updated_at: new Date().toISOString()
  };
};

async function syncEndpoint(label, baseUrl, maxTotal = 200) {
  console.log(`Fetching ${label} launches from TheSpaceDevs...`);

  let url = `${baseUrl}?limit=100&ordering=net`;
  let total = 0;
  let page = 1;

  while (url && total < maxTotal) {
    console.log(`Page ${page}: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Launch Library API error: ${res.status}`);
      process.exit(1);
    }

    const data = await res.json();
    const rows = (data.results || [])
      .filter((launch) => launch.id)
      .map(mapLaunch);

    if (rows.length > 0) {
      const { error } = await supabase
        .from('launches')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsert error:', error.message);
        process.exit(1);
      }

      total += rows.length;
      console.log(`Synced ${rows.length} ${label} launches. Total so far: ${total}.`);
    }

    url = data.next;
    page += 1;
    if (url && total < maxTotal) await delay(400);
  }

  return total;
}

async function syncLaunches() {
  const upcomingTotal = await syncEndpoint('upcoming', UPCOMING_URL, 200);
  const pastTotal = await syncEndpoint('past', PAST_URL, 200);

  const { count, error: countError } = await supabase
    .from('launches')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.warn('Could not verify row count:', countError.message);
  } else {
    console.log(`Supabase now contains ${count} launch records.`);
  }

  console.log(`Sync complete. Upcoming: ${upcomingTotal}. Past: ${pastTotal}.`);
}

syncLaunches().catch((error) => {
  console.error('Fatal sync error:', error);
  process.exit(1);
});
