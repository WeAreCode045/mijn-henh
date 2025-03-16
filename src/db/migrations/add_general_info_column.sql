
-- Add generalInfo JSON column to properties table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'generalInfo'
  ) THEN
    ALTER TABLE properties ADD COLUMN "generalInfo" JSONB DEFAULT NULL;
  END IF;
END $$;
