-- FIX MISSING COLUMNS
-- The error "Could not find the 'qr_base64' column" indicates this column is missing in your live database.

BEGIN;

-- Add qr_base64 column if it doesn't exist
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS qr_base64 text;

-- Also ensure other potentially new columns exist, just in case
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS hash text;

ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS issuer text DEFAULT 'National Quality Agency';

COMMIT;
