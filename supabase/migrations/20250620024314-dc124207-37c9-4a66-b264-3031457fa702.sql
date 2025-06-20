
-- First, add a unique constraint on accounts.user_id
ALTER TABLE accounts ADD CONSTRAINT unique_accounts_user_id UNIQUE (user_id);

-- Now add the foreign key constraint to ensure employer_profiles.id references accounts.user_id
ALTER TABLE employer_profiles 
ADD CONSTRAINT fk_employer_profiles_user_id 
FOREIGN KEY (id) REFERENCES accounts(user_id) ON DELETE CASCADE;

-- Ensure email consistency by updating employer_profiles where email is missing
UPDATE employer_profiles 
SET email = accounts.email 
FROM accounts 
WHERE employer_profiles.id = accounts.user_id 
AND (employer_profiles.email IS NULL OR employer_profiles.email = '');

-- Update display_name in accounts to be first_name + last_name from employer_profiles
UPDATE accounts 
SET display_name = TRIM(CONCAT(employer_profiles.first_name, ' ', employer_profiles.last_name))
FROM employer_profiles 
WHERE accounts.user_id = employer_profiles.id 
AND accounts.type = 'employee'
AND (employer_profiles.first_name IS NOT NULL OR employer_profiles.last_name IS NOT NULL);

-- Add a trigger to automatically update display_name when employer_profiles is updated
CREATE OR REPLACE FUNCTION update_account_display_name()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE accounts 
  SET display_name = TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name)),
      updated_at = NOW()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for display_name updates
DROP TRIGGER IF EXISTS trigger_update_display_name ON employer_profiles;
CREATE TRIGGER trigger_update_display_name
  AFTER UPDATE OF first_name, last_name ON employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_account_display_name();
