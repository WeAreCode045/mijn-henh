
-- First, let's check the current structure of the accounts table and add missing columns
DO $$ 
BEGIN
    -- Drop user_type if it exists (this was causing the original error)
    DROP TYPE IF EXISTS user_type CASCADE;
    
    -- Only create account_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('employee', 'participant');
    END IF;
    
    -- Check if user_role exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'agent', 'buyer', 'seller');
    END IF;
END $$;

-- Add role column to accounts table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'role') THEN
        ALTER TABLE accounts ADD COLUMN role user_role DEFAULT 'buyer';
    END IF;
END $$;

-- Add type column to accounts table if it doesn't exist  
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'type') THEN
        ALTER TABLE accounts ADD COLUMN type account_type DEFAULT 'participant';
    END IF;
END $$;

-- Now safely update existing columns to use the correct enum types
-- Update type column if it exists but isn't the right type
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'type') THEN
        ALTER TABLE accounts ALTER COLUMN type TYPE account_type USING 
          CASE 
            WHEN type::text IN ('admin', 'agent', 'employee') THEN 'employee'::account_type
            ELSE 'participant'::account_type
          END;
    END IF;
END $$;

-- Update role column if it exists but isn't the right type
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'role') THEN
        ALTER TABLE accounts ALTER COLUMN role TYPE user_role USING 
          CASE
            WHEN role::text = 'admin' THEN 'admin'::user_role
            WHEN role::text = 'agent' THEN 'agent'::user_role
            WHEN role::text = 'seller' THEN 'seller'::user_role
            ELSE 'buyer'::user_role
          END;
    END IF;
END $$;

-- Update any existing data to use 'employee' type for admin/agent roles
UPDATE accounts SET type = 'employee'::account_type WHERE role::text IN ('admin', 'agent');
