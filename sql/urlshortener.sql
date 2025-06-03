
CREATE TABLE IF NOT EXISTS urlshortener (
  short_code TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE urlshortener ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON urlshortener FOR INSERT WITH CHECK (true);

