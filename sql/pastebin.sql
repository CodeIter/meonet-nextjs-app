
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

-- Enable Row Level Security for the tables
ALTER TABLE public.pastebin ENABLE ROW LEVEL SECURITY;

-- Create policies for the pastebin table
CREATE POLICY "Enable write access for all users"
ON public.pastebin
FOR INSERT
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON public.pastebin
FOR SELECT
TO anon
USING (true);

SELECT * FROM pg_policies WHERE tablename IN ('pastebin');

