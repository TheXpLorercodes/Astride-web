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
    content.split('\n').forEach(line => {
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Basic knowledge base to match known photos and agency data
const KNOWN_ASTRONAUTS = {
  "Oleg Kononenko": { photo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Oleg_Kononenko_%28expedition_69%29.jpg", agency: "Roscosmos", role: "Commander" },
  "Tracy Caldwell Dyson": { photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Tracy_Caldwell_Dyson_official_portrait_2023.jpg", agency: "NASA", role: "Flight Engineer" },
  "Matthew Dominick": { photo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Matthew_Dominick_NASA_Astronaut_%28cropped%29.jpg", agency: "NASA", role: "Flight Engineer" },
  "Jeanette Epps": { photo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Jeanette_J._Epps_official_portrait_in_an_EMU_spacesuit_%282023%29.jpg", agency: "NASA", role: "Flight Engineer" },
  "Nikolai Chub": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nikolai_Chub_in_2022.jpg", agency: "Roscosmos", role: "Flight Engineer" },
  "Michael Barratt": { photo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Michael_R._Barratt.jpg", agency: "NASA", role: "Flight Engineer" },
  "Alexander Grebenkin": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Alexander_Grebenkin_Expedition_71.jpg", agency: "Roscosmos", role: "Flight Engineer" },
  "Butch Wilmore": { photo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Barry_E._Wilmore_portrait.jpg", agency: "NASA", role: "Commander (Starliner)" },
  "Sunita Williams": { photo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sunita_Williams_Official_Portrait_2_cropped.jpg", agency: "NASA", role: "Pilot (Starliner)" }
};

async function syncISSCrew() {
  console.log('Fetching live crew from Open-Notify API (by Natronics)...');
  
  try {
    const res = await fetch('http://api.open-notify.org/astros.json');
    if (!res.ok) throw new Error('API down');
    const data = await res.json();
    
    // Filter out only people currently on the ISS (removes Tiangong etc)
    const issCrewLive = data.people.filter(p => p.craft === 'ISS');
    console.log(`Found ${issCrewLive.length} crew members currently on the ISS.`);
    
    // Map to our database structure
    const updatedAstronauts = issCrewLive.map(astro => {
      const knownData = KNOWN_ASTRONAUTS[astro.name] || {};
      
      return {
        name: astro.name,
        agency: knownData.agency || "SPACE AGENCY",
        role: knownData.role || "Expedition Crew",
        photo: knownData.photo || null
      };
    });

    console.log('Updating Supabase iss_info table...');
    const { error } = await supabase
      .from('iss_info')
      .update({ astronauts: updatedAstronauts })
      .eq('id', 1);

    if (error) {
      console.error('Error updating database:', error);
      return;
    }

    console.log('Database successfully updated with live crew manifest from Open-Notify!');
  } catch (error) {
    console.error('Fatal sync error:', error);
  }
}

syncISSCrew();