import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('The sync requires the service role key because RLS blocks anon writes.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const PLANETS = [
  ['Mercury', { gravity: '3.7 m/s^2', day_length: '58.6 Earth days', orbital_period: '88 Earth days', temperature: '167 C avg', number_of_moons: 0, has_rings: false, brief_description: 'The smallest planet and the closest world to the Sun.', hero_paragraph: 'Mercury is a rocky inner planet with a heavily cratered surface, a huge iron core, and extreme day-to-night temperature swings.', facts: ['Smallest planet in the Solar System', 'Closest planet to the Sun', 'Long solar day of 176 Earth days', 'No moons and no rings'], atmosphere: [{ element: 'Oxygen', percentage: 42 }, { element: 'Sodium', percentage: 29 }, { element: 'Hydrogen', percentage: 22 }] }],
  ['Venus', { gravity: '8.87 m/s^2', day_length: '243 Earth days', orbital_period: '225 Earth days', temperature: '464 C avg', number_of_moons: 0, has_rings: false, brief_description: 'A shrouded world with a runaway greenhouse atmosphere.', hero_paragraph: 'Venus is similar in size to Earth, but its dense carbon dioxide atmosphere and sulfuric acid clouds make it the hottest planet in the Solar System.', facts: ['Hottest planet', 'Rotates retrograde', 'Dense CO2 atmosphere', 'Surface pressure about 92 times Earth'], atmosphere: [{ element: 'Carbon Dioxide', percentage: 96.5 }, { element: 'Nitrogen', percentage: 3.5 }] }],
  ['Earth', { gravity: '9.8 m/s^2', day_length: '24 hours', orbital_period: '365.25 days', temperature: '15 C avg', number_of_moons: 1, has_rings: false, brief_description: 'Our ocean world and the only known planet with life.', hero_paragraph: 'Earth is the third planet from the Sun and the only known world with stable liquid water oceans, active plate tectonics, and a biosphere.', facts: ['71 percent of the surface is covered by water', 'Only known inhabited world', 'Protected by a strong magnetic field', 'Supports a nitrogen-oxygen atmosphere'], atmosphere: [{ element: 'Nitrogen', percentage: 78 }, { element: 'Oxygen', percentage: 21 }, { element: 'Argon', percentage: 1 }] }],
  ['Mars', { gravity: '3.71 m/s^2', day_length: '24.6 hours', orbital_period: '687 Earth days', temperature: '-65 C avg', number_of_moons: 2, has_rings: false, brief_description: 'A cold desert planet with ancient river valleys and polar ice.', hero_paragraph: 'Mars is a rocky world shaped by volcanoes, canyons, dust storms, and evidence that liquid water once flowed across parts of its surface.', facts: ['Home to Olympus Mons', 'Has seasonal polar caps', 'Thin carbon dioxide atmosphere', 'Major target for robotic and future human exploration'], atmosphere: [{ element: 'Carbon Dioxide', percentage: 95.3 }, { element: 'Nitrogen', percentage: 2.7 }, { element: 'Argon', percentage: 1.6 }] }],
  ['Jupiter', { gravity: '24.79 m/s^2', day_length: '9.9 hours', orbital_period: '11.86 years', temperature: '-110 C avg', number_of_moons: 95, has_rings: true, brief_description: 'The largest planet, wrapped in clouds and giant storms.', hero_paragraph: 'Jupiter is a gas giant dominated by hydrogen and helium, with a powerful magnetic field and famous storms including the Great Red Spot.', facts: ['Largest planet in the Solar System', 'Has a faint ring system', 'Great Red Spot is a long-lived storm', 'Dozens of known moons'], atmosphere: [{ element: 'Hydrogen', percentage: 90 }, { element: 'Helium', percentage: 10 }] }],
  ['Saturn', { gravity: '10.44 m/s^2', day_length: '10.7 hours', orbital_period: '29.45 years', temperature: '-140 C avg', number_of_moons: 146, has_rings: true, brief_description: 'A giant planet famous for its bright icy rings.', hero_paragraph: 'Saturn is a low-density gas giant with the most extensive ring system in the Solar System and a large family of diverse moons.', facts: ['Most extensive ring system', 'Less dense than water', 'North pole hexagon storm', 'Moon Titan has a thick atmosphere'], atmosphere: [{ element: 'Hydrogen', percentage: 96 }, { element: 'Helium', percentage: 3 }] }],
  ['Uranus', { gravity: '8.69 m/s^2', day_length: '17.2 hours', orbital_period: '84 years', temperature: '-195 C avg', number_of_moons: 27, has_rings: true, brief_description: 'An ice giant tipped dramatically on its side.', hero_paragraph: 'Uranus is an ice giant whose extreme axial tilt makes its seasons unlike any other planet in the Solar System.', facts: ['Rotates on its side', 'Blue-green color from methane', 'Faint rings', 'Ice giant interior rich in volatiles'], atmosphere: [{ element: 'Hydrogen', percentage: 83 }, { element: 'Helium', percentage: 15 }, { element: 'Methane', percentage: 2 }] }],
  ['Neptune', { gravity: '11.15 m/s^2', day_length: '16.1 hours', orbital_period: '164.8 years', temperature: '-201 C avg', number_of_moons: 14, has_rings: true, brief_description: 'A dark, windy ice giant in the far outer Solar System.', hero_paragraph: 'Neptune is the most distant major planet, known for powerful winds, dynamic storms, and a methane-rich atmosphere that gives it a deep blue color.', facts: ['Strongest winds among the planets', 'Faint ring arcs', 'Ice giant composition', 'Major moon Triton likely captured'], atmosphere: [{ element: 'Hydrogen', percentage: 80 }, { element: 'Helium', percentage: 19 }, { element: 'Methane', percentage: 1.5 }] }]
];

const STARS = [
  ['Red Dwarf', { description: 'Small, cool main-sequence stars that burn their fuel slowly and can shine for trillions of years.', temperature: '2,400 - 3,700 K', star_type: 'M-type Main Sequence', example_star: 'Proxima Centauri', luminosity: '0.00001 - 0.08 Lsun' }],
  ['Yellow Dwarf', { description: 'Medium-mass G-type main-sequence stars like the Sun, stable for roughly 10 billion years.', temperature: '5,200 - 6,000 K', star_type: 'G-type Main Sequence', example_star: 'The Sun', luminosity: '0.6 - 1.5 Lsun' }],
  ['Blue Giant', { description: 'Very hot, massive stars that radiate intensely and live only a few million years.', temperature: '10,000 - 30,000 K', star_type: 'Blue Giant', example_star: 'Rigel', luminosity: '10,000 - 1,000,000 Lsun' }],
  ['Red Giant', { description: 'Evolved stars that have exhausted core hydrogen and expanded to enormous sizes.', temperature: '3,000 - 5,000 K', star_type: 'Red Giant', example_star: 'Betelgeuse', luminosity: '100 - 10,000 Lsun' }],
  ['White Dwarf', { description: 'Dense stellar remnants left after Sun-like stars shed their outer layers.', temperature: '8,000 - 40,000 K', star_type: 'White Dwarf Remnant', example_star: 'Sirius B', luminosity: '0.001 - 0.1 Lsun' }],
  ['Neutron Star', { description: 'Collapsed stellar cores with extreme density, rapid rotation, and powerful magnetic fields.', temperature: '600,000+ K', star_type: 'Neutron Star Remnant', example_star: 'PSR J1748-2446ad', luminosity: 'Variable' }]
];

const GALAXIES = [
  ['Milky Way', { description: 'Our home barred spiral galaxy, containing the Solar System and hundreds of billions of stars.', galaxy_type: 'Barred Spiral', diameter: '100,000 - 120,000 light-years', distance: 'Home galaxy', number_of_stars: '100 - 400 billion', age: '13.6 billion years', constellation: 'Sagittarius (galactic center)', is_featured: true }],
  ['Andromeda', { description: 'The nearest major galaxy to the Milky Way and our future merger partner.', galaxy_type: 'Spiral', diameter: '220,000 light-years', distance: '2.54 million light-years', number_of_stars: '~1 trillion', age: '10 billion years', constellation: 'Andromeda', is_featured: false }],
  ['Triangulum', { description: 'A relatively small spiral galaxy in the Local Group, sometimes cataloged as M33.', galaxy_type: 'Spiral', diameter: '60,000 light-years', distance: '2.73 million light-years', number_of_stars: '~40 billion', age: '10 billion years', constellation: 'Triangulum', is_featured: false }],
  ['Sombrero Galaxy', { description: 'A bright lenticular galaxy with a striking dust lane and prominent central bulge.', galaxy_type: 'Lenticular', diameter: '50,000 light-years', distance: '29.3 million light-years', number_of_stars: '~100 billion', age: '13 billion years', constellation: 'Virgo', is_featured: false }],
  ['Whirlpool Galaxy', { description: 'A grand-design spiral galaxy interacting with a smaller companion, creating vivid spiral structure.', galaxy_type: 'Spiral', diameter: '76,000 light-years', distance: '23 million light-years', number_of_stars: '~100 billion', age: '10 billion years', constellation: 'Canes Venatici', is_featured: false }]
];

const ASTEROIDS = [
  ['Bennu', { description: 'A carbon-rich near-Earth asteroid sampled by NASAs OSIRIS-REx mission.', diameter: '490 m', orbital_period: '1.2 years', discovery_date: 'September 11, 1999', spectral_type: 'B-type (carbonaceous)', is_potentially_hazardous: true }],
  ['Ceres', { description: 'The largest body in the asteroid belt and also classified as a dwarf planet.', diameter: '939 km', orbital_period: '4.6 years', discovery_date: 'January 1, 1801', spectral_type: 'C-type (carbonaceous)', is_potentially_hazardous: false }],
  ['Vesta', { description: 'A differentiated protoplanet with a basaltic crust and a giant south polar crater.', diameter: '525 km', orbital_period: '3.63 years', discovery_date: 'March 29, 1807', spectral_type: 'V-type (basaltic)', is_potentially_hazardous: false }],
  ['Apophis', { description: 'A near-Earth asteroid that will make a very close Earth flyby on April 13, 2029.', diameter: '370 m', orbital_period: '0.89 years', discovery_date: 'June 19, 2004', spectral_type: 'Sq-type', is_potentially_hazardous: true }],
  ['Ryugu', { description: 'A rubble-pile near-Earth asteroid explored in detail by the Hayabusa2 mission.', diameter: '900 m', orbital_period: '1.3 years', discovery_date: 'May 10, 1999', spectral_type: 'Cb-type (carbonaceous)', is_potentially_hazardous: true }]
];

async function applyUpdates(table, updates) {
  for (const [name, payload] of updates) {
    const { error } = await supabase.from(table).update(payload).ilike('name', name);
    if (error) {
      console.error(`Failed updating ${table}:${name}: ${error.message}`);
    } else {
      console.log(`Updated ${table}:${name}`);
    }
  }
}

await applyUpdates('planets', PLANETS);
await applyUpdates('stars', STARS);
await applyUpdates('galaxies', GALAXIES);
await applyUpdates('asteroids', ASTEROIDS);

console.log('Celestial data sync complete.');
