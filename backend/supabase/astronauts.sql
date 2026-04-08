-- ============================================================
-- Astronaut Records Table
-- ============================================================
-- Run this in Supabase SQL Editor.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS astronauts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spacedevs_id INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status JSONB,
  type JSONB,
  in_space BOOLEAN DEFAULT false,
  time_in_space TEXT,
  eva_time TEXT,
  age INT,
  date_of_birth DATE,
  date_of_death DATE,
  nationality TEXT,
  bio TEXT,
  twitter TEXT,
  instagram TEXT,
  wiki TEXT,
  agency JSONB,
  profile_image TEXT,
  profile_image_thumbnail TEXT,
  flights_count INT DEFAULT 0,
  landings_count INT DEFAULT 0,
  spacewalks_count INT DEFAULT 0,
  last_flight TIMESTAMPTZ,
  first_flight TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_astronauts_name ON astronauts (name);
CREATE INDEX IF NOT EXISTS idx_astronauts_nationality ON astronauts (nationality);
CREATE INDEX IF NOT EXISTS idx_astronauts_in_space ON astronauts (in_space);

ALTER TABLE astronauts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_astronauts" ON astronauts FOR SELECT USING (true);

-- Note: Inserts/updates are intentionally not allowed for anon.
-- Use the service role key in the sync script or run a SQL seed.
