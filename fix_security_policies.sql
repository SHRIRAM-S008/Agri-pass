-- FIX RLS POLICIES FOR STORAGE AND TABLES

-- 1. Unrestrictive Policy for 'Certificate' Storage Bucket
-- Creates a policy that allows anyone (anon key) to INSERT (upload) and SELECT (download)
-- Adjust 'Certificate' if your bucket name is case-sensitive (Supabase buckets are usually lowercase, but you said 'Certificate')

BEGIN;

-- Ensure the bucket exists (idempotent-ish)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('Certificate', 'Certificate', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access to Certificate Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads to Certificate Bucket" ON storage.objects;

-- Create blanket policy for the Certificate bucket
CREATE POLICY "Public Access to Certificate Bucket"
ON storage.objects FOR ALL
USING ( bucket_id = 'Certificate' )
WITH CHECK ( bucket_id = 'Certificate' );

COMMIT;


-- 2. Unrestrictive Policies for Public Tables (If previously blocked)
-- Should already be there from schema.sql, but re-applying acts as a fix.

BEGIN;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for all users" ON public.certificates;

CREATE POLICY "Enable all access for all users"
ON public.certificates FOR ALL
USING (true)
WITH CHECK (true);

COMMIT;
