-- ============================================================
-- Seed Data for All Dedicated Tables + Cross-References
-- ============================================================
-- Run AFTER schema_tables.sql
-- ============================================================

-- ========================================
-- PLANETS (8 solar system planets)
-- ========================================
INSERT INTO planets (id, name, image, description, color, diameter, distance_from_sun, mass, orbital_period, number_of_moons, has_rings) VALUES
  ('11111111-0000-4000-8000-000000000001', 'Mercury',
   'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
   'The smallest and fastest planet, closest to the Sun with extreme temperature swings.',
   '#8C7853', '4,879 km', '57.9M km', '3.285 × 10²³ kg', '88 days', 0, false),

  ('11111111-0002-4000-8000-000000000002', 'Venus',
   'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg',
   'The hottest planet with thick clouds of sulfuric acid and a runaway greenhouse effect.',
   '#FFC649', '12,104 km', '108.2M km', '4.867 × 10²⁴ kg', '225 days', 0, false),

  ('11111111-0003-4000-8000-000000000003', 'Earth',
   'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
   'Our blue marble home — the only known planet to harbor life.',
   '#4A90E2', '12,742 km', '149.6M km', '5.972 × 10²⁴ kg', '365.25 days', 1, false),

  ('11111111-0004-4000-8000-000000000004', 'Mars',
   'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
   'The red planet with ancient riverbeds, polar ice caps, and the tallest volcano in the solar system.',
   '#E27B58', '6,779 km', '227.9M km', '6.39 × 10²³ kg', '687 days', 2, false),

  ('11111111-0005-4000-8000-000000000005', 'Jupiter',
   'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
   'The largest planet in our solar system, famous for the Great Red Spot storm.',
   '#C88B3A', '139,820 km', '778.5M km', '1.898 × 10²⁷ kg', '11.86 years', 95, true),

  ('11111111-0006-4000-8000-000000000006', 'Saturn',
   'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
   'Famous for its stunning ring system, the most extensive in the solar system.',
   '#FAD5A5', '116,460 km', '1.4B km', '5.683 × 10²⁶ kg', '29.46 years', 146, true),

  ('11111111-0007-4000-8000-000000000007', 'Uranus',
   'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
   'The tilted ice giant — rotates on its side with an axial tilt of 98 degrees.',
   '#4FD0E7', '50,724 km', '2.9B km', '8.681 × 10²⁵ kg', '84 years', 27, true),

  ('11111111-0008-4000-8000-000000000008', 'Neptune',
   'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
   'The windiest planet in our system with winds reaching 2,100 km/h.',
   '#4166F5', '49,244 km', '4.5B km', '1.024 × 10²⁶ kg', '164.8 years', 16, true);

-- ========================================
-- STARS (6 types)
-- ========================================
INSERT INTO stars (id, name, image, description, color, temperature, star_type, example_star, luminosity) VALUES
  ('22222222-0000-4000-8000-000000000001', 'Red Dwarf', NULL,
   'The most common type of star in the Milky Way. Small, cool, and extremely long-lived — some will burn for trillions of years.',
   '#FF6B6B', '2,500 - 4,000 K', 'Main Sequence', 'Proxima Centauri', '0.0001 - 0.08 L☉'),

  ('22222222-0002-4000-8000-000000000002', 'Yellow Dwarf', NULL,
   'Medium-sized main-sequence stars like our Sun. They burn hydrogen for about 10 billion years.',
   '#FFD93D', '5,200 - 6,000 K', 'Main Sequence', 'The Sun', '0.6 - 1.5 L☉'),

  ('22222222-0003-4000-8000-000000000003', 'Blue Giant', NULL,
   'Massive, extremely hot, and short-lived stars that burn through fuel in just millions of years.',
   '#4ECDC4', '10,000 - 30,000 K', 'Giant', 'Rigel', '10,000 - 1,000,000 L☉'),

  ('22222222-0004-4000-8000-000000000004', 'Red Giant', NULL,
   'Aging stars that have exhausted core hydrogen and expanded to enormous sizes.',
   '#FF8C42', '3,000 - 5,000 K', 'Giant', 'Betelgeuse', '100 - 1,000 L☉'),

  ('22222222-0005-4000-8000-000000000005', 'White Dwarf', NULL,
   'Dense stellar remnants — the final stage of low-to-medium mass stars after shedding outer layers.',
   '#E0E0E0', '8,000 - 40,000 K', 'Remnant', 'Sirius B', '0.001 - 0.1 L☉'),

  ('22222222-0006-4000-8000-000000000006', 'Neutron Star', NULL,
   'Ultra-dense stellar cores left after supernova explosions. A teaspoon weighs about a billion tons.',
   '#B388FF', '600,000+ K', 'Remnant', 'PSR J1748-2446ad', 'Variable');

-- ========================================
-- GALAXIES
-- ========================================
INSERT INTO galaxies (id, name, image, description, galaxy_type, diameter, distance, number_of_stars, age, constellation, is_featured) VALUES
  ('33333333-0001-4000-8000-000000000001', 'Milky Way', 'https://upload.wikimedia.org/wikipedia/commons/4/43/ESO-VLT-Laser-phot-33a-07.jpg',
   'Our home galaxy — a barred spiral containing 200-400 billion stars. Our Solar System is located about 27,000 light-years from the galactic center.',
   'Barred Spiral', '100,000 light-years', 'N/A (home galaxy)', '200-400 billion', '13.6 billion years', 'Sagittarius (center)', true),

  ('33333333-0002-4000-8000-000000000002', 'Andromeda', 'https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg',
   'The nearest large galaxy to the Milky Way, on a collision course with us in about 4.5 billion years.',
   'Spiral', '220,000 light-years', '2.537 million light-years', '~1 trillion', '10 billion years', 'Andromeda', false),

  ('33333333-0003-4000-8000-000000000003', 'Triangulum', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/M33.jpg',
   'The third-largest galaxy in the Local Group, a spiral galaxy visible to the naked eye under dark skies.',
   'Spiral', '60,000 light-years', '2.73 million light-years', '~40 billion', '10 billion years', 'Triangulum', false),

  ('33333333-0004-4000-8000-000000000004', 'Sombrero Galaxy', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg',
   'An iconic galaxy with a bright nucleus and prominent dust lane, resembling a sombrero hat.',
   'Lenticular', '50,000 light-years', '29.3 million light-years', '~100 billion', '13 billion years', 'Virgo', false),

  ('33333333-0005-4000-8000-000000000005', 'Whirlpool Galaxy', 'https://upload.wikimedia.org/wikipedia/commons/d/db/Messier51_sRGB.jpg',
   'A grand-design spiral galaxy interacting with a smaller companion galaxy NGC 5195.',
   'Spiral', '76,000 light-years', '23 million light-years', '~100 billion', '10 billion years', 'Canes Venatici', false);

-- ========================================
-- ASTEROIDS
-- ========================================
INSERT INTO asteroids (id, name, image, description, diameter, orbital_period, discovery_date, spectral_type, is_potentially_hazardous) VALUES
  ('44444444-0001-4000-8000-000000000001', 'Bennu',
   'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bennu_mosaic_OSIRIS-REx.png',
   'A carbonaceous near-Earth asteroid studied by NASA''s OSIRIS-REx mission, which collected a sample and returned it to Earth in 2023.',
   '490 m', '1.2 years', 'September 11, 1999', 'B-type (carbonaceous)', true),

  ('44444444-0002-4000-8000-000000000002', 'Ceres',
   'https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg',
   'The largest object in the asteroid belt and a dwarf planet. Contains water ice and was explored by NASA''s Dawn mission.',
   '939 km', '4.6 years', 'January 1, 1801', 'C-type (carbonaceous)', false),

  ('44444444-0003-4000-8000-000000000003', 'Vesta',
   'https://upload.wikimedia.org/wikipedia/commons/e/e3/Vesta_full_mosaic.jpg',
   'The second-largest asteroid in the belt with a giant impact crater at its south pole.',
   '525 km', '3.63 years', 'March 29, 1807', 'V-type (basaltic)', false),

  ('44444444-0004-4000-8000-000000000004', 'Apophis',
   NULL,
   'A near-Earth asteroid that will pass extremely close to Earth in 2029 — visible to the naked eye.',
   '370 m', '0.89 years', 'June 19, 2004', 'Sq-type', true),

  ('44444444-0005-4000-8000-000000000005', 'Ryugu',
   'https://upload.wikimedia.org/wikipedia/commons/d/d9/Ryugu_colored.jpg',
   'A diamond-shaped near-Earth asteroid explored by JAXA''s Hayabusa2 mission.',
   '900 m', '1.3 years', 'May 10, 1999', 'Cb-type (carbonaceous)', true);

-- ========================================
-- MISSIONS
-- ========================================
INSERT INTO missions (id, name, image, description, launch_date, end_date, agencies, target, status) VALUES
  ('55555555-0001-4000-8000-000000000001', 'Cassini-Huygens',
   'https://upload.wikimedia.org/wikipedia/commons/b/b2/Cassini_Saturn_Orbit_Insertion.jpg',
   'Studied Saturn, its rings, and moons for over 13 years. The Huygens probe landed on Titan — the first landing in the outer solar system.',
   'October 15, 1997', 'September 15, 2017', 'NASA / ESA / ASI', 'Saturn', 'completed'),

  ('55555555-0002-4000-8000-000000000002', 'OSIRIS-REx',
   'https://upload.wikimedia.org/wikipedia/commons/1/14/OSIRIS-REx_spacecraft.jpg',
   'Collected a sample from asteroid Bennu and returned it to Earth in September 2023.',
   'September 8, 2016', 'September 24, 2023', 'NASA', 'Bennu', 'completed'),

  ('55555555-0003-4000-8000-000000000003', 'Voyager 1',
   'https://upload.wikimedia.org/wikipedia/commons/2/24/Voyager_spacecraft.jpg',
   'The farthest human-made object from Earth, now in interstellar space. Flew past Jupiter and Saturn.',
   'September 5, 1977', NULL, 'NASA', 'Jupiter, Saturn, Interstellar Space', 'active'),

  ('55555555-0004-4000-8000-000000000004', 'Mars Perseverance',
   'https://upload.wikimedia.org/wikipedia/commons/6/64/PIA23764-Mars2020-Rover-Illustration.jpg',
   'Searching for signs of ancient microbial life on Mars and collecting samples for future return to Earth.',
   'July 30, 2020', NULL, 'NASA', 'Mars', 'active'),

  ('55555555-0005-4000-8000-000000000005', 'James Webb Space Telescope',
   'https://upload.wikimedia.org/wikipedia/commons/f/f3/JWST_spacecraft_model_2.png',
   'The most powerful space telescope ever built, observing in infrared to see the earliest galaxies.',
   'December 25, 2021', NULL, 'NASA / ESA / CSA', 'Deep Space', 'active'),

  ('55555555-0006-4000-8000-000000000006', 'Dawn',
   NULL,
   'Explored two of the largest objects in the asteroid belt — Vesta and Ceres — using ion propulsion.',
   'September 27, 2007', 'November 1, 2018', 'NASA', 'Vesta, Ceres', 'completed'),

  ('55555555-0007-4000-8000-000000000007', 'Hayabusa2',
   NULL,
   'JAXA sample return mission that collected subsurface material from asteroid Ryugu.',
   'December 3, 2014', 'December 6, 2020', 'JAXA', 'Ryugu', 'completed');

-- ========================================
-- SPACE PHENOMENA
-- ========================================
INSERT INTO space_phenomena (id, name, image, description, phenomenon_type, discovery_date, distance, size, constellation) VALUES
  ('66666666-0001-4000-8000-000000000001', 'Sagittarius A*',
   'https://upload.wikimedia.org/wikipedia/commons/a/a5/Sgr_A%2A_EHT.jpg',
   'The supermassive black hole at the center of the Milky Way, with a mass of about 4 million Suns.',
   'black_hole', '1974', '26,000 light-years', '~44 million km diameter', 'Sagittarius'),

  ('66666666-0002-4000-8000-000000000002', 'Crab Nebula',
   'https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg',
   'A supernova remnant from a star explosion recorded by Chinese astronomers in 1054 AD.',
   'nebula', '1731', '6,500 light-years', '11 light-years across', 'Taurus'),

  ('66666666-0003-4000-8000-000000000003', 'Pillars of Creation',
   'https://upload.wikimedia.org/wikipedia/commons/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
   'Iconic columns of interstellar gas and dust in the Eagle Nebula where new stars are being born.',
   'nebula', '1995', '6,500-7,000 light-years', '~5 light-years tall', 'Serpens'),

  ('66666666-0004-4000-8000-000000000004', 'Cygnus X-1',
   NULL,
   'One of the first confirmed black holes, a stellar-mass black hole orbiting a blue supergiant star.',
   'black_hole', '1964', '6,070 light-years', '~21 solar masses', 'Cygnus'),

  ('66666666-0005-4000-8000-000000000005', 'Vela Pulsar',
   NULL,
   'A rapidly spinning neutron star that rotates 11 times per second, the remnant of a supernova about 10,000 years ago.',
   'pulsar', '1968', '950 light-years', '~20 km diameter', 'Vela');

-- ========================================
-- CROSS REFERENCES (relationships)
-- ========================================

-- Saturn ↔ Cassini
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('planets', '11111111-0006-4000-8000-000000000006', 'missions', '55555555-0001-4000-8000-000000000001', 'has_mission'),
  ('missions', '55555555-0001-4000-8000-000000000001', 'planets', '11111111-0006-4000-8000-000000000006', 'studied');

-- Jupiter ↔ Voyager 1
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('planets', '11111111-0005-4000-8000-000000000005', 'missions', '55555555-0003-4000-8000-000000000003', 'has_mission'),
  ('missions', '55555555-0003-4000-8000-000000000003', 'planets', '11111111-0005-4000-8000-000000000005', 'studied');

-- Saturn ↔ Voyager 1
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('planets', '11111111-0006-4000-8000-000000000006', 'missions', '55555555-0003-4000-8000-000000000003', 'has_mission'),
  ('missions', '55555555-0003-4000-8000-000000000003', 'planets', '11111111-0006-4000-8000-000000000006', 'studied');

-- Mars ↔ Perseverance
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('planets', '11111111-0004-4000-8000-000000000004', 'missions', '55555555-0004-4000-8000-000000000004', 'has_mission'),
  ('missions', '55555555-0004-4000-8000-000000000004', 'planets', '11111111-0004-4000-8000-000000000004', 'studying');

-- Bennu ↔ OSIRIS-REx
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('asteroids', '44444444-0001-4000-8000-000000000001', 'missions', '55555555-0002-4000-8000-000000000002', 'has_mission'),
  ('missions', '55555555-0002-4000-8000-000000000002', 'asteroids', '44444444-0001-4000-8000-000000000001', 'studied');

-- Ryugu ↔ Hayabusa2
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('asteroids', '44444444-0005-4000-8000-000000000005', 'missions', '55555555-0007-4000-8000-000000000007', 'has_mission'),
  ('missions', '55555555-0007-4000-8000-000000000007', 'asteroids', '44444444-0005-4000-8000-000000000005', 'studied');

-- Ceres & Vesta ↔ Dawn
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('asteroids', '44444444-0002-4000-8000-000000000002', 'missions', '55555555-0006-4000-8000-000000000006', 'has_mission'),
  ('asteroids', '44444444-0003-4000-8000-000000000003', 'missions', '55555555-0006-4000-8000-000000000006', 'has_mission'),
  ('missions', '55555555-0006-4000-8000-000000000006', 'asteroids', '44444444-0002-4000-8000-000000000002', 'studied'),
  ('missions', '55555555-0006-4000-8000-000000000006', 'asteroids', '44444444-0003-4000-8000-000000000003', 'studied');

-- Milky Way ↔ Sagittarius A*
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('galaxies', '33333333-0001-4000-8000-000000000001', 'space_phenomena', '66666666-0001-4000-8000-000000000001', 'contains'),
  ('space_phenomena', '66666666-0001-4000-8000-000000000001', 'galaxies', '33333333-0001-4000-8000-000000000001', 'located_in');

-- JWST ↔ Galaxies (observes)
INSERT INTO cross_references (source_table, source_id, target_table, target_id, relation_type) VALUES
  ('missions', '55555555-0005-4000-8000-000000000005', 'galaxies', '33333333-0002-4000-8000-000000000002', 'observed'),
  ('missions', '55555555-0005-4000-8000-000000000005', 'space_phenomena', '66666666-0003-4000-8000-000000000003', 'observed');
