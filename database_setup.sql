-- SQL script to set up the admins table in Supabase

-- 1. Create the admins table
CREATE TABLE public.admins (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. Create select policy for authenticated users checking their own records
CREATE POLICY "Allow individual read access" ON public.admins
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 4. Example insert (uncomment and replace placeholders to register an admin):
-- INSERT INTO public.admins (id, email) VALUES ('PASTE_USER_UUID_HERE', 'admin@company.com');
