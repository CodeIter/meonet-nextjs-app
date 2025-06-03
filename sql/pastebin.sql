
CREATE TABLE IF NOT EXISTS pastebin (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  encryption TEXT NOT NULL,
  password_hash TEXT,
  salt TEXT,
  iv TEXT,
  cipher_algorithm TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  syntax TEXT,
  keywords TEXT[]
);

ALTER TABLE pastebin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON pastebin FOR INSERT WITH CHECK (true);

