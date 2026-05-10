-- ============================================================
-- Launches Table
-- ============================================================
-- Run this in Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS launches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status JSONB,
  net TIMESTAMPTZ,
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ,
  launch_service_provider JSONB,
  rocket JSONB,
  mission JSONB,
  pad JSONB,
  image TEXT,
  infographic TEXT,
  webcast_live BOOLEAN,
  probability INT,
  program JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_launches_net ON launches (net);
CREATE INDEX IF NOT EXISTS idx_launches_status ON launches ((status->>'name'));
CREATE INDEX IF NOT EXISTS idx_launches_provider ON launches ((launch_service_provider->>'name'));

CREATE TABLE IF NOT EXISTS launch_tracker_profiles (
  launch_id TEXT PRIMARY KEY REFERENCES launches (id) ON DELETE CASCADE,
  prev_launch_id TEXT REFERENCES launches (id) ON DELETE SET NULL,
  next_launch_id TEXT REFERENCES launches (id) ON DELETE SET NULL,
  tracker_title TEXT,
  tracker_summary TEXT,
  hero_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_launch_tracker_prev ON launch_tracker_profiles (prev_launch_id);
CREATE INDEX IF NOT EXISTS idx_launch_tracker_next ON launch_tracker_profiles (next_launch_id);

ALTER TABLE launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_tracker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_launches" ON launches FOR SELECT USING (true);
CREATE POLICY "public_read_launch_tracker_profiles" ON launch_tracker_profiles FOR SELECT USING (true);

-- Note: Inserts/updates are intentionally blocked for anon.
-- Use the service role key in the sync script.
