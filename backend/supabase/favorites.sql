-- ============================================================
-- Space Explorer System — Favorites Table (Supabase)
-- ============================================================

-- 6. favorites — User's saved space objects, photos, etc.
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id     TEXT NOT NULL, -- e.g., 'apod-2023-10-27', 'mars-1234', 'planet-mars'
  item_type   TEXT NOT NULL, -- 'apod', 'mars', 'planet', 'asteroid'
  item_data   JSONB NOT NULL, -- metadata for display (title, url, etc)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favorites" 
  ON favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
  ON favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_favorites_user_id ON favorites (user_id);
