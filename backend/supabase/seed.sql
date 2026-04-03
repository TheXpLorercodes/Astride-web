-- ============================================================
-- Space Explorer System — Sample Seed Data
-- ============================================================
-- Run this AFTER schema.sql in the Supabase SQL editor.
-- Uses fixed UUIDs so relationships can reference them.
-- ============================================================

-- --------------------------------------------------------
-- Space Objects
-- --------------------------------------------------------

-- Saturn (planet)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saturn', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
   'The sixth planet from the Sun, famous for its stunning ring system.');

-- Cassini (mission linked to Saturn)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cassini-Huygens', 'mission',
   'https://upload.wikimedia.org/wikipedia/commons/b/b2/Cassini_Saturn_Orbit_Insertion.jpg',
   'A joint NASA/ESA/ASI mission that studied Saturn, its rings, and moons from 2004 to 2017.');

-- Andromeda (galaxy)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Andromeda Galaxy', 'galaxy',
   'https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg',
   'The nearest large galaxy to the Milky Way, approximately 2.5 million light-years away.');

-- Bennu (asteroid)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Bennu', 'asteroid',
   'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bennu_mosaic_OSIRIS-REx.png',
   'A carbonaceous near-Earth asteroid studied by NASA''s OSIRIS-REx mission.');

-- Hubble (telescope)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Hubble Space Telescope', 'telescope',
   'https://upload.wikimedia.org/wikipedia/commons/2/2f/Hubble_ultra_deep_field.jpg',
   'A space telescope launched in 1990 that has revolutionized observational astronomy.');

-- Titan (planet — Saturn''s moon, treated as a planet-type for richness)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Titan', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/8/84/Titan_in_natural_color_Cassini.jpg',
   'Saturn''s largest moon, the only moon in the solar system with a dense atmosphere.');

-- Enceladus (planet — Saturn''s icy moon)
INSERT INTO space_objects (id, name, category, image, short_description) VALUES
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Enceladus', 'planet',
   'https://upload.wikimedia.org/wikipedia/commons/8/83/PIA17202_-_Approaching_Enceladus.jpg',
   'A small icy moon of Saturn with geysers that shoot water vapor into space.');

-- --------------------------------------------------------
-- Metadata (key-value pairs)
-- --------------------------------------------------------

-- Saturn metadata
INSERT INTO metadata (object_id, key, value) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'diameter', '116,460 km'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'mass', '5.683 × 10²⁶ kg'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'orbital_period', '29.4571 years'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'distance_from_sun', '1.434 billion km'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'number_of_moons', '146'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'ring_system', 'Yes — most extensive in the solar system');

-- Cassini metadata
INSERT INTO metadata (object_id, key, value) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'launch_date', 'October 15, 1997'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'arrival_date', 'July 1, 2004'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'mission_end', 'September 15, 2017'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'agencies', 'NASA / ESA / ASI'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'total_orbits', '294 orbits of Saturn');

-- Andromeda metadata
INSERT INTO metadata (object_id, key, value) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'type', 'Barred spiral galaxy'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'distance', '2.537 million light-years'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'diameter', '220,000 light-years'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'number_of_stars', '~1 trillion'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'constellation', 'Andromeda');

-- Bennu metadata
INSERT INTO metadata (object_id, key, value) VALUES
  ('a1b2c3d4-0004-4000-8000-000000000004', 'diameter', '490 m'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'orbital_period', '1.1955 years'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'discovery_date', 'September 11, 1999'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'spectral_type', 'B-type (carbonaceous)'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'potentially_hazardous', 'Yes');

-- Hubble metadata
INSERT INTO metadata (object_id, key, value) VALUES
  ('a1b2c3d4-0005-4000-8000-000000000005', 'launch_date', 'April 24, 1990'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'orbit_altitude', '547 km'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'mirror_diameter', '2.4 m'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'wavelength_range', 'Ultraviolet, visible, near-infrared'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'total_observations', '1.5 million+');

-- --------------------------------------------------------
-- Details (long-form descriptions)
-- --------------------------------------------------------

INSERT INTO details (object_id, description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001',
   'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine-and-a-half times that of Earth. Saturn''s most iconic feature is its extensive ring system, composed primarily of ice particles with a smaller amount of rocky debris and dust. The planet has at least 146 known moons, with Titan being the largest. Saturn''s atmosphere is mostly hydrogen and helium, and wind speeds can reach up to 1,800 km/h near the equator.'),
  ('a1b2c3d4-0002-4000-8000-000000000002',
   'The Cassini-Huygens mission was a collaborative project between NASA, the European Space Agency (ESA), and the Italian Space Agency (ASI). Launched on October 15, 1997, Cassini arrived at Saturn on July 1, 2004, and spent over 13 years studying the planet, its rings, and its moons. The Huygens probe successfully landed on Titan on January 14, 2005, becoming the first landing in the outer Solar System. The mission concluded on September 15, 2017, when Cassini intentionally plunged into Saturn''s atmosphere.'),
  ('a1b2c3d4-0003-4000-8000-000000000003',
   'The Andromeda Galaxy (M31) is a barred spiral galaxy approximately 2.5 million light-years from Earth. It is the nearest large galaxy to the Milky Way and is expected to collide and merge with it in about 4.5 billion years. With an estimated one trillion stars, Andromeda is the most massive galaxy in the Local Group, which also includes the Milky Way, the Triangulum Galaxy, and about 80 smaller galaxies.'),
  ('a1b2c3d4-0004-4000-8000-000000000004',
   'Bennu is a carbonaceous near-Earth asteroid discovered on September 11, 1999. It has a mean diameter of about 490 meters and completes an orbit around the Sun every 1.2 years. NASA''s OSIRIS-REx spacecraft arrived at Bennu in December 2018, collected a sample from the surface in October 2020, and returned the sample to Earth in September 2023. The study of Bennu provides insights into the early solar system and the origins of life.'),
  ('a1b2c3d4-0005-4000-8000-000000000005',
   'The Hubble Space Telescope (HST) is a space telescope launched into low Earth orbit on April 24, 1990. It remains one of the largest and most versatile space telescopes, renowned for its stunning deep-field images. Hubble has made over 1.5 million observations and contributed to more than 19,000 peer-reviewed scientific publications. It has helped determine the rate of expansion of the universe, confirmed the existence of supermassive black holes at galaxy centres, and produced the Hubble Deep Field images.');

-- --------------------------------------------------------
-- Facts
-- --------------------------------------------------------

-- Saturn facts
INSERT INTO facts (object_id, fact) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saturn is the least dense planet — it would float in water if you could find a bathtub big enough.'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saturn''s rings span up to 282,000 km but are only about 10 meters thick.'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'A day on Saturn lasts only 10.7 hours, making it the second-fastest rotating planet.'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saturn has a hexagonal storm at its north pole that is approximately 30,000 km across.');

-- Cassini facts
INSERT INTO facts (object_id, fact) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cassini discovered seven new moons of Saturn.'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'The Huygens probe took 2 hours and 27 minutes to descend to Titan''s surface.'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cassini traveled 7.9 billion km during its entire mission.');

-- Andromeda facts
INSERT INTO facts (object_id, fact) VALUES
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Andromeda is visible to the naked eye on moonless nights from dark-sky locations.'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Andromeda is approaching the Milky Way at about 110 km/s.'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'It contains roughly 1 trillion stars — two to three times the Milky Way''s count.');

-- Bennu facts
INSERT INTO facts (object_id, fact) VALUES
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Bennu has a 1-in-2,700 chance of impacting Earth between 2175 and 2199.'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'OSIRIS-REx collected about 60 grams of material from Bennu''s surface.'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Bennu completes one rotation every 4.3 hours.');

-- Hubble facts
INSERT INTO facts (object_id, fact) VALUES
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Hubble orbits the Earth at about 27,300 km/h, completing one orbit every 95 minutes.'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'The telescope was named after astronomer Edwin Hubble.'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Hubble''s Extreme Deep Field image contains about 5,500 galaxies, some over 13 billion years old.');

-- --------------------------------------------------------
-- Relationships
-- --------------------------------------------------------

-- Saturn ↔ Cassini
INSERT INTO relationships (source_id, target_id, relation_type) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'has_mission'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'studied');

-- Saturn ↔ Titan (moon)
INSERT INTO relationships (source_id, target_id, relation_type) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0006-4000-8000-000000000006', 'has_moon'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001', 'orbits');

-- Saturn ↔ Enceladus (moon)
INSERT INTO relationships (source_id, target_id, relation_type) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0007-4000-8000-000000000007', 'has_moon'),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0001-4000-8000-000000000001', 'orbits');

-- Cassini → Titan (studied)
INSERT INTO relationships (source_id, target_id, relation_type) VALUES
  ('a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0006-4000-8000-000000000006', 'studied'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0007-4000-8000-000000000007', 'studied');

-- Hubble → Andromeda (observed)
INSERT INTO relationships (source_id, target_id, relation_type) VALUES
  ('a1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0003-4000-8000-000000000003', 'observed'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0005-4000-8000-000000000005', 'observed_by');
