-- ============================================================
-- ISS Information Table
-- Contains historical & real-time telemetry structure for the ISS tracker page
-- ============================================================

CREATE TABLE IF NOT EXISTS iss_info (
  id INT PRIMARY KEY DEFAULT 1,
  built_date TEXT,
  participating_countries INT,
  construction_details TEXT,
  crew_stay_duration TEXT,
  modules JSONB,
  astronauts JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: We use ON CONFLICT to safely seed/update without duplicating
INSERT INTO iss_info (id, built_date, participating_countries, construction_details, crew_stay_duration, modules, astronauts)
VALUES (
  1,
  'November 20, 1998',
  15,
  'Assembled in low Earth orbit over 136 consecutive space flights using both the US Space Shuttle and Russian Proton/Soyuz rockets. It began with the Zarya module in 1998 and has been continuously occupied since November 2000.',
  'Standard expeditions last roughly 6 months (180 days). However, extended scientific missions studying the long-term effects of microgravity on the human body can last over a full year (e.g., Frank Rubio/Scott Kelly).',
  '[
    {"name": "Zarya", "type": "Functional Cargo Block", "agency": "Roscosmos (Russia)", "purpose": "Original power & propulsion."},
    {"name": "Unity (Node 1)", "type": "Connecting Node", "agency": "NASA (USA)", "purpose": "First US segment, connecting nodes."},
    {"name": "Zvezda", "type": "Service Module", "agency": "Roscosmos (Russia)", "purpose": "Life support systems."},
    {"name": "Destiny", "type": "Laboratory Module", "agency": "NASA (USA)", "purpose": "Primary US research facility."},
    {"name": "Columbus", "type": "Science Laboratory", "agency": "ESA (Europe)", "purpose": "Multidisciplinary scientific lab."},
    {"name": "Kibo", "type": "Experiment Module", "agency": "JAXA (Japan)", "purpose": "Largest single module, specialized experiments."},
    {"name": "Cupola", "type": "Observatory", "agency": "ESA/NASA", "purpose": "7-window module for robotic ops and Earth watching."}
  ]'::jsonb,
  '[
    {"name": "Oleg Kononenko", "agency": "Roscosmos", "role": "Commander", "photo": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Oleg_Kononenko_%28expedition_69%29.jpg"},
    {"name": "Tracy C. Dyson", "agency": "NASA", "role": "Flight Engineer", "photo": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Tracy_Caldwell_Dyson_official_portrait_2023.jpg"},
    {"name": "Matthew Dominick", "agency": "NASA", "role": "Flight Engineer", "photo": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Matthew_Dominick_NASA_Astronaut_%28cropped%29.jpg"},
    {"name": "Jeanette Epps", "agency": "NASA", "role": "Flight Engineer", "photo": "https://upload.wikimedia.org/wikipedia/commons/d/df/Jeanette_J._Epps_official_portrait_in_an_EMU_spacesuit_%282023%29.jpg"}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  built_date = EXCLUDED.built_date,
  participating_countries = EXCLUDED.participating_countries,
  construction_details = EXCLUDED.construction_details,
  crew_stay_duration = EXCLUDED.crew_stay_duration,
  modules = EXCLUDED.modules,
  astronauts = EXCLUDED.astronauts,
  updated_at = NOW();
