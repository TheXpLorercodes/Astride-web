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

ALTER TABLE launches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_launches" ON launches FOR SELECT USING (true);

-- Note: Inserts/updates are intentionally blocked for anon.
-- Use the service role key in the sync script.
