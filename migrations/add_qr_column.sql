-- Migration: Add QR Base64 column to certificates table
-- Run this if you already have an existing certificates table

-- Add qr_base64 column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'certificates' 
        AND column_name = 'qr_base64'
    ) THEN
        ALTER TABLE public.certificates 
        ADD COLUMN qr_base64 text;
        
        RAISE NOTICE 'Column qr_base64 added successfully';
    ELSE
        RAISE NOTICE 'Column qr_base64 already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'certificates' 
AND column_name = 'qr_base64';
