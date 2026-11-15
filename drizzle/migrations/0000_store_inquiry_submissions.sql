CREATE TABLE public.inquiry_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 source text NOT NULL CHECK (source IN ('contact','investor','business')),
 kind text NOT NULL CHECK (char_length(kind) BETWEEN 1 AND 100),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
 phone text CHECK (char_length(phone) <= 20),
 company text CHECK (char_length(company) <= 120),
 message text NOT NULL CHECK (char_length(message) BETWEEN 5 AND 1000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.inquiry_submissions TO service_role;
ALTER TABLE public.inquiry_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX inquiry_submissions_created_at_idx ON public.inquiry_submissions(created_at DESC);