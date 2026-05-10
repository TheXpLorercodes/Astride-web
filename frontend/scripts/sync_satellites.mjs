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

const SATELLITES = [
  {
    name: 'International Space Station',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station_after_undocking_of_STS-132.jpg',
    description: 'A permanently crewed orbital laboratory circling Earth in low Earth orbit.',
    color: '#60a5fa',
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
    facts: ['Hosts long-duration astronaut crews in microgravity', 'Supports biology, physics, and Earth observation research', 'Assembled from multiple pressurized modules and truss elements', 'Completes about 16 orbits of Earth each day'],
    main_parts: [{ name: 'Pressurized Modules', function: 'Living quarters, labs, and docking volumes for crew and experiments.' }, { name: 'Integrated Truss', function: 'Backbone carrying radiators, power channels, and support hardware.' }, { name: 'Solar Arrays', function: 'Generate electrical power for station systems.' }, { name: 'Robotic Systems', function: 'Move cargo, support maintenance, and assist visiting vehicle operations.' }]
  },
  {
    name: 'Hubble Space Telescope',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
    description: 'A flagship observatory in low Earth orbit delivering high-resolution imagery across multiple wavelengths.',
    color: '#a78bfa',
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
    facts: ['Observes in ultraviolet, visible, and near-infrared wavelengths', 'Enabled deep-field views that transformed cosmology', 'Was serviced by multiple Space Shuttle missions', 'Still operating decades after launch'],
    main_parts: [{ name: '2.4 m Primary Mirror', function: 'Collects and focuses incoming light.' }, { name: 'Scientific Instruments', function: 'Capture images and spectra across multiple bands.' }, { name: 'Fine Guidance Sensors', function: 'Keep the observatory pointed with high precision.' }, { name: 'Solar Arrays', function: 'Provide electrical power for telescope operations.' }]
  },
  {
    name: 'James Webb Space Telescope',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/JWST_spacecraft_model_2.png',
    description: 'An infrared observatory operating around Sun-Earth L2 for deep-space astronomy.',
    color: '#f59e0b',
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
    facts: ['Optimized for infrared astronomy', 'Uses a five-layer sunshield for passive cooling', 'Studies early galaxies, exoplanets, and star formation', 'Operates far beyond low Earth orbit'],
    main_parts: [{ name: 'Segmented Primary Mirror', function: 'Large gold-coated mirror gathers faint infrared light.' }, { name: 'Sunshield', function: 'Blocks heat from the Sun, Earth, and Moon.' }, { name: 'Science Instruments', function: 'Imaging and spectroscopy across infrared wavelengths.' }, { name: 'Spacecraft Bus', function: 'Handles communications, propulsion, and attitude control.' }]
  },
  {
    name: 'Landsat 8',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Landsat_Data_Continuity_Mission.jpg',
    description: 'An Earth-observing satellite collecting multispectral imagery for land and water monitoring.',
    color: '#22c55e',
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
    facts: ['Provides medium-resolution land imaging', 'Continues the long-running Landsat record', 'Images Earth in visible, infrared, and thermal bands', 'Supports agriculture, water, and disaster analysis'],
    main_parts: [{ name: 'OLI', function: 'Operational Land Imager collects visible to shortwave infrared data.' }, { name: 'TIRS', function: 'Thermal Infrared Sensor measures land-surface temperature.' }, { name: 'Spacecraft Bus', function: 'Supports power, data handling, and communications.' }, { name: 'Solar Array', function: 'Supplies spacecraft electrical power.' }]
  },
  {
    name: 'Terra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Terra_satellite_model_1.png',
    description: 'A long-running Earth system science satellite measuring the atmosphere, land, and energy balance.',
    color: '#06b6d4',
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
    facts: ['Part of NASAs Earth Observing System', 'Measures clouds, aerosols, land cover, and radiation', 'Carries multiple major Earth science instruments', 'Supports long-term climate records'],
    main_parts: [{ name: 'MODIS', function: 'Global imaging for clouds, oceans, and land processes.' }, { name: 'ASTER', function: 'High-resolution imaging of Earths surface.' }, { name: 'CERES', function: 'Measures Earth radiation budget.' }, { name: 'MISR', function: 'Multi-angle imaging of aerosols and clouds.' }]
  },
  {
    name: 'Aqua',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Aqua_%28satellite%29.jpg',
    description: 'An Earth-observing satellite focused on the water cycle, atmosphere, and climate processes.',
    color: '#38bdf8',
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
    facts: ['Tracks water vapor, clouds, precipitation, and sea surface temperature', 'Works as part of the A-Train constellation heritage', 'Supports weather and climate science', 'Carries six Earth-observing instruments'],
    main_parts: [{ name: 'AIRS', function: 'Infrared sounder for temperature and humidity profiles.' }, { name: 'AMSR-E Heritage', function: 'Microwave observations of water-related processes.' }, { name: 'MODIS', function: 'Global imaging for land, ocean, and atmosphere.' }, { name: 'CERES', function: 'Measures Earth radiation budget.' }]
  },
  {
    name: 'NOAA-20',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/JPSS-1_in_orbit.jpg',
    description: 'A polar-orbiting weather satellite delivering operational environmental data for forecasting and climate products.',
    color: '#f97316',
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
    facts: ['Delivers operational data for weather forecasting', 'Part of the Joint Polar Satellite System', 'Flies in afternoon polar orbit', 'Supports storm tracking, sea ice, fires, and atmospheric sounding'],
    main_parts: [{ name: 'VIIRS', function: 'Visible and infrared imaging for clouds, land, and oceans.' }, { name: 'CrIS', function: 'Hyperspectral infrared sounder for atmospheric profiles.' }, { name: 'ATMS', function: 'Microwave sounding through clouds and precipitation.' }, { name: 'OMPS', function: 'Ozone mapping and profiling.' }]
  },
  {
    name: 'GOES-16',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/10/GOES-R_Spacecraft.jpg',
    description: 'A geostationary weather satellite providing rapid imagery and environmental monitoring for the Western Hemisphere.',
    color: '#ec4899',
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
    facts: ['Provides full-disk and rapid-scan Earth imagery', 'Tracks storms, lightning, and space weather', 'Part of the GOES-R Series', 'Supports forecasting across the Americas and Atlantic'],
    main_parts: [{ name: 'ABI', function: 'Advanced Baseline Imager for high-frequency weather imagery.' }, { name: 'GLM', function: 'Geostationary Lightning Mapper detects total lightning.' }, { name: 'SUVI', function: 'Solar ultraviolet imaging for space weather monitoring.' }, { name: 'EXIS', function: 'Measures solar X-ray and extreme ultraviolet output.' }]
  }
];

for (const satellite of SATELLITES) {
  const { error } = await supabase.from('satellites').upsert(satellite, { onConflict: 'name' });
  if (error) {
    console.error(`Failed syncing ${satellite.name}: ${error.message}`);
  } else {
    console.log(`Synced ${satellite.name}`);
  }
}

console.log('Satellite sync complete.');
