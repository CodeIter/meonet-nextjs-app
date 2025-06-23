
CREATE TABLE IF NOT EXISTS urlshortener (
  short_code TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for the tables
ALTER TABLE public.urlshortener ENABLE ROW LEVEL SECURITY;

-- Create policies for the urlshortener table
CREATE POLICY "Enable write access for all users"
ON public.urlshortener
FOR INSERT
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON public.urlshortener
FOR SELECT
TO anon
USING (true);

SELECT * FROM pg_policies WHERE tablename IN ('urlshortener');

