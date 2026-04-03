-- ============================================================
-- Dedicated Category Tables + Cross-References
-- ============================================================
-- Run this in Supabase SQL Editor.
-- This creates 6 category tables + 1 relationship table.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. PLANETS
-- ========================================
CREATE TABLE IF NOT EXISTS planets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  image             TEXT,
  description       TEXT,
  color             TEXT,
  diameter          TEXT,
  distance_from_sun TEXT,
  mass              TEXT,
  orbital_period    TEXT,
  number_of_moons   INTEGER DEFAULT 0,
  has_rings         BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_planets_name ON planets (name);

-- ========================================
-- 2. STARS
-- ========================================
CREATE TABLE IF NOT EXISTS stars (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  image         TEXT,
  description   TEXT,
  color         TEXT,
  temperature   TEXT,
  star_type     TEXT,
  example_star  TEXT,
  luminosity    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stars_name ON stars (name);

-- ========================================
-- 3. GALAXIES
-- ========================================
CREATE TABLE IF NOT EXISTS galaxies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  image           TEXT,
  description     TEXT,
  galaxy_type     TEXT,
  diameter        TEXT,
  distance        TEXT,
  number_of_stars TEXT,
  age             TEXT,
  constellation   TEXT,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_galaxies_name ON galaxies (name);

-- ========================================
-- 4. ASTEROIDS
-- ========================================
CREATE TABLE IF NOT EXISTS asteroids (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                     TEXT NOT NULL,
  image                    TEXT,
  description              TEXT,
  diameter                 TEXT,
  orbital_period           TEXT,
  discovery_date           TEXT,
  spectral_type            TEXT,
  is_potentially_hazardous BOOLEAN DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_asteroids_name ON asteroids (name);

-- ========================================
-- 5. MISSIONS
-- ========================================
CREATE TABLE IF NOT EXISTS missions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  image       TEXT,
  description TEXT,
  launch_date TEXT,
  end_date    TEXT,
  agencies    TEXT,
  target      TEXT,
  status      TEXT DEFAULT 'completed',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_missions_name ON missions (name);
CREATE INDEX idx_missions_status ON missions (status);

-- ========================================
-- 6. SPACE PHENOMENA
-- ========================================
CREATE TABLE IF NOT EXISTS space_phenomena (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  image           TEXT,
  description     TEXT,
  phenomenon_type TEXT,
  discovery_date  TEXT,
  distance        TEXT,
  size            TEXT,
  constellation   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_phenomena_name ON space_phenomena (name);
CREATE INDEX idx_phenomena_type ON space_phenomena (phenomenon_type);

-- ========================================
-- 7. CROSS REFERENCES (relationships)
-- ========================================
CREATE TABLE IF NOT EXISTS cross_references (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_table  TEXT NOT NULL,
  source_id     UUID NOT NULL,
  target_table  TEXT NOT NULL,
  target_id     UUID NOT NULL,
  relation_type TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xref_source ON cross_references (source_table, source_id);
CREATE INDEX idx_xref_target ON cross_references (target_table, target_id);

-- ========================================
-- ROW LEVEL SECURITY — public read
-- ========================================
ALTER TABLE planets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stars            ENABLE ROW LEVEL SECURITY;
ALTER TABLE galaxies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE asteroids        ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_phenomena  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_planets"    ON planets          FOR SELECT USING (true);
CREATE POLICY "public_read_stars"      ON stars            FOR SELECT USING (true);
CREATE POLICY "public_read_galaxies"   ON galaxies         FOR SELECT USING (true);
CREATE POLICY "public_read_asteroids"  ON asteroids        FOR SELECT USING (true);
CREATE POLICY "public_read_missions"   ON missions         FOR SELECT USING (true);
CREATE POLICY "public_read_phenomena"  ON space_phenomena  FOR SELECT USING (true);
CREATE POLICY "public_read_xref"       ON cross_references FOR SELECT USING (true);
