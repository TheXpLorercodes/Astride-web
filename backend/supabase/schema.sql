-- ============================================================
-- Space Explorer System — PostgreSQL Schema (Supabase)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- Custom ENUM for space object categories
-- --------------------------------------------------------
CREATE TYPE space_category AS ENUM (
  'planet',
  'mission',
  'asteroid',
  'galaxy',
  'pulsar',
  'telescope',
  'research',
  'star',
  'solar_system'
);

-- --------------------------------------------------------
-- 1. space_objects — Core entity table
-- --------------------------------------------------------
CREATE TABLE space_objects (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  category          space_category NOT NULL,
  image             TEXT,
  short_description TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_space_objects_category ON space_objects (category);
CREATE INDEX idx_space_objects_name     ON space_objects (name);

-- --------------------------------------------------------
-- 2. metadata — Flexible key/value pairs per object
-- --------------------------------------------------------
CREATE TABLE metadata (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_id UUID NOT NULL REFERENCES space_objects(id) ON DELETE CASCADE,
  key       TEXT NOT NULL,
  value     TEXT NOT NULL
);

CREATE INDEX idx_metadata_object_id ON metadata (object_id);

-- --------------------------------------------------------
-- 3. details — Long-form description per object
-- --------------------------------------------------------
CREATE TABLE details (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_id   UUID NOT NULL REFERENCES space_objects(id) ON DELETE CASCADE,
  description TEXT NOT NULL
);

CREATE INDEX idx_details_object_id ON details (object_id);

-- --------------------------------------------------------
-- 4. facts — Fun facts per object
-- --------------------------------------------------------
CREATE TABLE facts (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_id UUID NOT NULL REFERENCES space_objects(id) ON DELETE CASCADE,
  fact      TEXT NOT NULL
);

CREATE INDEX idx_facts_object_id ON facts (object_id);

-- --------------------------------------------------------
-- 5. relationships — Graph edges between space objects
-- --------------------------------------------------------
CREATE TABLE relationships (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id     UUID NOT NULL REFERENCES space_objects(id) ON DELETE CASCADE,
  target_id     UUID NOT NULL REFERENCES space_objects(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL
);

CREATE INDEX idx_relationships_source ON relationships (source_id);
CREATE INDEX idx_relationships_target ON relationships (target_id);

-- --------------------------------------------------------
-- Row Level Security (optional — enable if needed)
-- By default Supabase enables RLS; these policies allow
-- public read access which is suitable for a public explorer.
-- --------------------------------------------------------
ALTER TABLE space_objects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE metadata       ENABLE ROW LEVEL SECURITY;
ALTER TABLE details        ENABLE ROW LEVEL SECURITY;
ALTER TABLE facts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships  ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read on space_objects"  ON space_objects  FOR SELECT USING (true);
CREATE POLICY "Allow public read on metadata"       ON metadata       FOR SELECT USING (true);
CREATE POLICY "Allow public read on details"        ON details        FOR SELECT USING (true);
CREATE POLICY "Allow public read on facts"          ON facts          FOR SELECT USING (true);
CREATE POLICY "Allow public read on relationships"  ON relationships  FOR SELECT USING (true);
