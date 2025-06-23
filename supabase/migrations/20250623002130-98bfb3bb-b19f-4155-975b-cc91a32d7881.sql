
-- Modify handle_new_user to only create employer profiles, not accounts
-- This prevents automatic employee account creation for all users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only insert into employer_profiles for new users
  -- Accounts will be created manually based on intended user type
  INSERT INTO public.employer_profiles (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(split_part(new.raw_user_meta_data->>'full_name', ' ', 1), ''),
    CASE 
      WHEN new.raw_user_meta_data->>'full_name' IS NOT NULL AND position(' ' in new.raw_user_meta_data->>'full_name') > 0 
      THEN substr(new.raw_user_meta_data->>'full_name', position(' ' in new.raw_user_meta_data->>'full_name') + 1) 
      ELSE '' 
    END
  );
  
  RETURN new;
END;
$function$;

-- Create trigger for participant profile creation when participant accounts are created
DROP TRIGGER IF EXISTS on_participant_account_created ON public.accounts;
CREATE TRIGGER on_participant_account_created
  AFTER INSERT OR UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_participant_signup();
