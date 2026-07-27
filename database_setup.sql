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

-- 5. Create the hr_employees table
CREATE TABLE public.hr_employees (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hr_employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  designation TEXT NOT NULL,
  joining_date DATE NOT NULL,
  department TEXT NOT NULL,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for hr_employees
-- Adjust policies if authentication check is needed (e.g. TO authenticated)
CREATE POLICY "Allow public read access" ON public.hr_employees
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.hr_employees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON public.hr_employees
  FOR DELETE USING (true);

CREATE POLICY "Allow public update access" ON public.hr_employees
  FOR UPDATE USING (true) WITH CHECK (true);

-- 8. Create Table for team_leaders
CREATE TABLE public.team_leaders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  leader_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email_id TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  designation TEXT,
  joining_date DATE,
  department TEXT,
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.team_leaders ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS Policies for team_leaders
CREATE POLICY "Allow public read access" ON public.team_leaders
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.team_leaders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON public.team_leaders
  FOR DELETE USING (true);

CREATE POLICY "Allow public update access" ON public.team_leaders
  FOR UPDATE USING (true) WITH CHECK (true);


