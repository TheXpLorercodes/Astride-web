import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
  console.error('The sync requires the service role key because RLS blocks anon writes.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const PLANET_UPGRADES = [
  {
    name: 'Mercury',
    gravity: '3.7 m/s²',
    day_length: '58.6 days',
    year_length: '88 days',
    temperature: '167°C avg',
    moon_count: 0,
    rings: false,
    brief_description: 'The smallest planet and closest to the Sun.',
    hero_paragraph: 'Mercury is the smallest planet in our solar system and the closest to the Sun. It has a cratered surface, much like our Moon, and experiences extreme temperature fluctuations.',
    facts: ["Smallest planet", "Closest to the Sun", "Extreme temperature swings", "Solid cratered surface"],
    atmosphere: [{ element: 'Oxygen', percentage: 42 }, { element: 'Sodium', percentage: 29 }, { element: 'Hydrogen', percentage: 22 }]
  },
  {
    name: 'Venus',
    gravity: '8.87 m/s²',
    day_length: '243 days',
    year_length: '225 days',
    temperature: '464°C avg',
    moon_count: 0,
    rings: false,
    brief_description: 'Earth\'s "evil twin" with a runaway greenhouse effect.',
    hero_paragraph: 'Venus is the second planet from the Sun and is often called Earth\'s sister planet due to their similar size and mass. However, its atmosphere is a deathtrap of thick carbon dioxide and sulfuric acid.',
    facts: ["Hottest planet", "Rotates backwards", "Crushing atmosphere", "Volcanic landscape"],
    atmosphere: [{ element: 'CO2', percentage: 96 }, { element: 'Nitrogen', percentage: 3.5 }, { element: 'Sulfur', percentage: 0.5 }]
  },
  {
    name: 'Earth',
    gravity: '9.8 m/s²',
    day_length: '24h',
    year_length: '365 days',
    temperature: '15°C avg',
    moon_count: 1,
    rings: false,
    brief_description: 'Our blue marble home — the only known world with life.',
    hero_paragraph: 'Earth is the third planet from the Sun and the only place we know of so far that’s inhabited by living things. Its surface is 71% water, making it a "Blue Marble" in space.',
    facts: ["Supports life", "Liquid water on surface", "Protective atmosphere", "Tectonic activity"],
    atmosphere: [{ element: 'Nitrogen', percentage: 78 }, { element: 'Oxygen', percentage: 21 }, { element: 'Argon', percentage: 1 }]
  },
  {
    name: 'Mars',
    gravity: '3.71 m/s²',
    day_length: '24.6h',
    year_length: '687 days',
    temperature: '-65°C avg',
    moon_count: 2,
    rings: false,
    brief_description: 'The Red Planet — a cold, desert world with ancient riverbeds.',
    hero_paragraph: 'Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. It is also home to the largest volcano in the solar system, Olympus Mons.',
    facts: ["Red planet", "Has polar ice caps", "Mount Olympus", "Evidence of water"],
    atmosphere: [{ element: 'CO2', percentage: 95 }, { element: 'Nitrogen', percentage: 2.7 }, { element: 'Argon', percentage: 1.6 }]
  },
  {
    name: 'Jupiter',
    gravity: '24.79 m/s²',
    day_length: '9.9h',
    year_length: '11.9 years',
    temperature: '-110°C avg',
    moon_count: 95,
    rings: true,
    brief_description: 'The king of planets — a massive gas giant with a Great Red Spot.',
    hero_paragraph: 'Jupiter is more than twice as massive as the other planets of our solar system combined. It is a gas giant with 95 official moons and a century-old storm called the Great Red Spot.',
    facts: ["Massive gas giant", "Great Red Spot storm", "Strong magnetic field", "Dozens of moons"],
    atmosphere: [{ element: 'Hydrogen', percentage: 90 }, { element: 'Helium', percentage: 10 }]
  },
  {
    name: 'Saturn',
    gravity: '10.44 m/s²',
    day_length: '10.7h',
    year_length: '29.5 years',
    temperature: '-140°C avg',
    moon_count: 146,
    rings: true,
    brief_description: 'Adorned with the most spectacular ring system in the solar system.',
    hero_paragraph: 'Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system.',
    facts: ["Spectacular rings", "Least dense planet", "Hexagonal storm", "Huge moon Titan"],
    atmosphere: [{ element: 'Hydrogen', percentage: 96 }, { element: 'Helium', percentage: 3 }]
  },
  {
    name: 'Uranus',
    gravity: '8.69 m/s²',
    day_length: '17.2h',
    year_length: '84 years',
    temperature: '-195°C avg',
    moon_count: 27,
    rings: true,
    brief_description: 'An ice giant that tilts on its side as it orbits.',
    hero_paragraph: 'Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It rotate at a nearly 90-degree angle from the plane of its orbit.',
    facts: ["Ice giant", "Rotates on its side", "Extreme axial tilt", "Faint rings"],
    atmosphere: [{ element: 'Hydrogen', percentage: 83 }, { element: 'Helium', percentage: 15 }, { element: 'Methane', percentage: 2 }]
  },
  {
    name: 'Neptune',
    gravity: '11.15 m/s²',
    day_length: '16.1h',
    year_length: '165 years',
    temperature: '-201°C avg',
    moon_count: 14,
    rings: true,
    brief_description: 'The windiest planet — a dark, cold ice giant with supersonic winds.',
    hero_paragraph: 'Dark, cold and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system. It is almost 30 times as far from the Sun as Earth is.',
    facts: ["Windiest planet", "Supersonic winds", "Deep blue color", "Active weather"],
    atmosphere: [{ element: 'Hydrogen', percentage: 80 }, { element: 'Helium', percentage: 19 }, { element: 'Methane', percentage: 1 }]
  }
];

async function updatePlanets() {
  console.log("🚀 Upgrading Planetary Database...");
  
  for (const p of PLANET_UPGRADES) {
    console.log(`Processing ${p.name}...`);
    
    const { data, error } = await supabase
      .from('planets')
      .update({
        gravity: p.gravity,
        day_length: p.day_length,
        orbital_period: p.year_length, // Match their column name
        mass: p.mass,
        temperature: p.temperature,
        number_of_moons: p.moon_count, // Match their column name
        has_rings: p.rings,           // Match their column name
        brief_description: p.brief_description,
        hero_paragraph: p.hero_paragraph,
        facts: p.facts,
        atmosphere: p.atmosphere
      })
      .ilike('name', p.name);

    if (error) {
      console.error(`❌ Error updating ${p.name}:`, error.message);
    } else {
      console.log(`✅ ${p.name} upgraded successfully.`);
    }
  }
  
  console.log("\n✨ Database Migration Complete!");
}

updatePlanets();
