-- ============================================================
-- Page Data Migration — Planets, Stars, Galaxies, Solar System
-- ============================================================
-- Run AFTER schema.sql (and optionally after seed.sql).
-- If your DB already has the old enum, run this first:
--   ALTER TYPE space_category ADD VALUE IF NOT EXISTS 'star';
--   ALTER TYPE space_category ADD VALUE IF NOT EXISTS 'solar_system';
-- ============================================================

-- ========================================
-- PLANETS (8 planets)
-- ========================================

INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('b0000000-0001-4000-8000-000000000001', 'Mercury', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
   'The smallest and fastest planet'),
  ('b0000000-0002-4000-8000-000000000002', 'Venus', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg',
   'The hottest planet with thick clouds'),
  ('b0000000-0003-4000-8000-000000000003', 'Earth', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
   'Our blue marble home'),
  ('b0000000-0004-4000-8000-000000000004', 'Mars', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
   'The red planet with ancient riverbeds'),
  ('b0000000-0005-4000-8000-000000000005', 'Jupiter', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
   'The largest planet with the Great Red Spot'),
  ('b0000000-0006-4000-8000-000000000006', 'Saturn', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
   'Famous for its stunning ring system'),
  ('b0000000-0007-4000-8000-000000000007', 'Uranus', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
   'The tilted ice giant'),
  ('b0000000-0008-4000-8000-000000000008', 'Neptune', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
   'The windiest planet in our system');

-- Planet metadata: color, diameter, distance_from_sun
INSERT INTO metadata (object_id, key, value) VALUES
  -- Mercury
  ('b0000000-0001-4000-8000-000000000001', 'color', '#8C7853'),
  ('b0000000-0001-4000-8000-000000000001', 'diameter', '4,879 km'),
  ('b0000000-0001-4000-8000-000000000001', 'distance_from_sun', '57.9M km'),
  -- Venus
  ('b0000000-0002-4000-8000-000000000002', 'color', '#FFC649'),
  ('b0000000-0002-4000-8000-000000000002', 'diameter', '12,104 km'),
  ('b0000000-0002-4000-8000-000000000002', 'distance_from_sun', '108.2M km'),
  -- Earth
  ('b0000000-0003-4000-8000-000000000003', 'color', '#4A90E2'),
  ('b0000000-0003-4000-8000-000000000003', 'diameter', '12,742 km'),
  ('b0000000-0003-4000-8000-000000000003', 'distance_from_sun', '149.6M km'),
  -- Mars
  ('b0000000-0004-4000-8000-000000000004', 'color', '#E27B58'),
  ('b0000000-0004-4000-8000-000000000004', 'diameter', '6,779 km'),
  ('b0000000-0004-4000-8000-000000000004', 'distance_from_sun', '227.9M km'),
  -- Jupiter
  ('b0000000-0005-4000-8000-000000000005', 'color', '#C88B3A'),
  ('b0000000-0005-4000-8000-000000000005', 'diameter', '139,820 km'),
  ('b0000000-0005-4000-8000-000000000005', 'distance_from_sun', '778.5M km'),
  -- Saturn
  ('b0000000-0006-4000-8000-000000000006', 'color', '#FAD5A5'),
  ('b0000000-0006-4000-8000-000000000006', 'diameter', '116,460 km'),
  ('b0000000-0006-4000-8000-000000000006', 'distance_from_sun', '1.4B km'),
  -- Uranus
  ('b0000000-0007-4000-8000-000000000007', 'color', '#4FD0E7'),
  ('b0000000-0007-4000-8000-000000000007', 'diameter', '50,724 km'),
  ('b0000000-0007-4000-8000-000000000007', 'distance_from_sun', '2.9B km'),
  -- Neptune
  ('b0000000-0008-4000-8000-000000000008', 'color', '#4166F5'),
  ('b0000000-0008-4000-8000-000000000008', 'diameter', '49,244 km'),
  ('b0000000-0008-4000-8000-000000000008', 'distance_from_sun', '4.5B km');

-- ========================================
-- STARS (6 star types)
-- ========================================

INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('c0000000-0001-4000-8000-000000000001', 'Red Dwarf', 'star',
   NULL, 'The most common type of star, small and cool'),
  ('c0000000-0002-4000-8000-000000000002', 'Yellow Dwarf', 'star',
   NULL, 'Medium-sized stars like our Sun'),
  ('c0000000-0003-4000-8000-000000000003', 'Blue Giant', 'star',
   NULL, 'Massive, hot, and short-lived stars'),
  ('c0000000-0004-4000-8000-000000000004', 'Red Giant', 'star',
   NULL, 'Aging stars that have expanded'),
  ('c0000000-0005-4000-8000-000000000005', 'White Dwarf', 'star',
   NULL, 'Dense remnants of dead stars'),
  ('c0000000-0006-4000-8000-000000000006', 'Neutron Star', 'star',
   NULL, 'Ultra-dense stellar cores');

-- Star metadata: color, temperature, example_star
INSERT INTO metadata (object_id, key, value) VALUES
  ('c0000000-0001-4000-8000-000000000001', 'color', '#FF6B6B'),
  ('c0000000-0001-4000-8000-000000000001', 'temperature', '2,500 - 4,000 K'),
  ('c0000000-0001-4000-8000-000000000001', 'example_star', 'Proxima Centauri'),

  ('c0000000-0002-4000-8000-000000000002', 'color', '#FFD93D'),
  ('c0000000-0002-4000-8000-000000000002', 'temperature', '5,200 - 6,000 K'),
  ('c0000000-0002-4000-8000-000000000002', 'example_star', 'The Sun'),

  ('c0000000-0003-4000-8000-000000000003', 'color', '#4ECDC4'),
  ('c0000000-0003-4000-8000-000000000003', 'temperature', '10,000 - 30,000 K'),
  ('c0000000-0003-4000-8000-000000000003', 'example_star', 'Rigel'),

  ('c0000000-0004-4000-8000-000000000004', 'color', '#FF8C42'),
  ('c0000000-0004-4000-8000-000000000004', 'temperature', '3,000 - 5,000 K'),
  ('c0000000-0004-4000-8000-000000000004', 'example_star', 'Betelgeuse'),

  ('c0000000-0005-4000-8000-000000000005', 'color', '#E0E0E0'),
  ('c0000000-0005-4000-8000-000000000005', 'temperature', '8,000 - 40,000 K'),
  ('c0000000-0005-4000-8000-000000000005', 'example_star', 'Sirius B'),

  ('c0000000-0006-4000-8000-000000000006', 'color', '#B388FF'),
  ('c0000000-0006-4000-8000-000000000006', 'temperature', '600,000+ K'),
  ('c0000000-0006-4000-8000-000000000006', 'example_star', 'PSR J1748-2446ad');

-- Star info panel (stored as a detail on a parent "Stellar Classification" object)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('c0000000-0010-4000-8000-000000000010', 'Stellar Classification', 'star',
   NULL, 'Understanding the diverse types of stars illuminating our universe');

INSERT INTO details (object_id, description) VALUES
  ('c0000000-0010-4000-8000-000000000010',
   'Stars form from collapsing clouds of gas and dust called nebulae. As gravity pulls the material together, the core heats up until nuclear fusion begins, marking the birth of a new star.');

INSERT INTO metadata (object_id, key, value) VALUES
  ('c0000000-0010-4000-8000-000000000010', 'info_title', 'How Stars Are Born'),
  ('c0000000-0010-4000-8000-000000000010', 'is_page_info', 'true');

-- ========================================
-- GALAXIES (4 types + Milky Way)
-- ========================================

INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('d0000000-0001-4000-8000-000000000001', 'Spiral', 'galaxy',
   '🌀', 'Flat, rotating disks with spiral arms'),
  ('d0000000-0002-4000-8000-000000000002', 'Elliptical', 'galaxy',
   '⭕', 'Smooth, featureless galaxies'),
  ('d0000000-0003-4000-8000-000000000003', 'Irregular', 'galaxy',
   '☁️', 'No distinct shape or structure'),
  ('d0000000-0004-4000-8000-000000000004', 'Lenticular', 'galaxy',
   '💿', 'Disk-like with no spiral arms');

INSERT INTO metadata (object_id, key, value) VALUES
  ('d0000000-0001-4000-8000-000000000001', 'example', 'Milky Way'),
  ('d0000000-0002-4000-8000-000000000002', 'example', 'M87'),
  ('d0000000-0003-4000-8000-000000000003', 'example', 'Large Magellanic Cloud'),
  ('d0000000-0004-4000-8000-000000000004', 'example', 'NGC 5866');

-- Milky Way (special featured galaxy)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('d0000000-0010-4000-8000-000000000010', 'Milky Way', 'galaxy',
   NULL, 'Our home galaxy — a barred spiral approximately 100,000 light-years across');

INSERT INTO metadata (object_id, key, value) VALUES
  ('d0000000-0010-4000-8000-000000000010', 'type', 'Barred Spiral'),
  ('d0000000-0010-4000-8000-000000000010', 'age', '13.6 billion years'),
  ('d0000000-0010-4000-8000-000000000010', 'diameter', '100,000 light-years'),
  ('d0000000-0010-4000-8000-000000000010', 'is_featured', 'true');

INSERT INTO details (object_id, description) VALUES
  ('d0000000-0010-4000-8000-000000000010',
   'The Milky Way is a barred spiral galaxy approximately 100,000 light-years across. It contains 200-400 billion stars, and our Solar System is located about 27,000 light-years from the galactic center.');

-- Galaxy page intro (stored as detail on a parent object)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('d0000000-0020-4000-8000-000000000020', 'Galactic Structures', 'galaxy',
   NULL, 'Massive cosmic islands containing billions of stars');

INSERT INTO details (object_id, description) VALUES
  ('d0000000-0020-4000-8000-000000000020',
   'Galaxies are vast collections of stars, gas, dust, and dark matter bound together by gravity. Our universe contains an estimated 2 trillion galaxies, each containing hundreds of billions of stars.');

INSERT INTO metadata (object_id, key, value) VALUES
  ('d0000000-0020-4000-8000-000000000020', 'is_page_intro', 'true');

-- ========================================
-- SOLAR SYSTEM
-- ========================================

INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('e0000000-0001-4000-8000-000000000001', 'Our Solar System', 'solar_system',
   NULL, 'The Sun and everything bound to it by gravity');

INSERT INTO details (object_id, description) VALUES
  ('e0000000-0001-4000-8000-000000000001',
   'Our solar system consists of the Sun and everything bound to it by gravity: eight planets, dozens of moons, millions of asteroids, comets, and meteoroids. It formed about 4.6 billion years ago from a giant rotating cloud of gas and dust.');

INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('e0000000-0002-4000-8000-000000000002', 'Exoplanetary Systems', 'solar_system',
   NULL, 'Alien solar systems beyond our own');

INSERT INTO details (object_id, description) VALUES
  ('e0000000-0002-4000-8000-000000000002',
   'Beyond our solar system, astronomers have discovered thousands of exoplanets orbiting distant stars. These alien solar systems reveal incredible diversity: hot Jupiters orbiting closer to their stars than Mercury, super-Earths larger than our planet, and systems with multiple planets in tight orbits.');

-- Solar System fact boxes (as metadata on a facts parent)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('e0000000-0010-4000-8000-000000000010', 'Solar System Facts', 'solar_system',
   NULL, 'Key numbers about our cosmic neighborhood');

INSERT INTO metadata (object_id, key, value) VALUES
  ('e0000000-0010-4000-8000-000000000010', 'is_fact_boxes', 'true'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_1_number', '5,000+'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_1_label', 'Confirmed Exoplanets'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_2_number', '4.6B'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_2_label', 'Years Old'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_3_number', '8'),
  ('e0000000-0010-4000-8000-000000000010', 'fact_3_label', 'Planets in Our System');
