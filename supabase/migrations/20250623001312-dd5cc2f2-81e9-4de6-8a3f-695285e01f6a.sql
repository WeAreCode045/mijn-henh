
-- Fix the handle_new_user function to properly cast enum types
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- For new users, default to agent role (can be changed later)
  INSERT INTO public.accounts (user_id, role, type, status, email, display_name)
  VALUES (
    new.id, 
    'agent', 
    'employee', 
    'active', 
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  
  -- Insert into employer_profiles for new users by default
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

-- Also fix the handle_new_participant_signup function
CREATE OR REPLACE FUNCTION public.handle_new_participant_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only proceed if this is a participant account
  IF NEW.type = 'participant' THEN
    -- Create participant profile if it doesn't exist
    INSERT INTO public.participants_profile (id, email, first_name, last_name)
    VALUES (
      NEW.user_id,
      NEW.email,
      COALESCE(split_part((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id), ' ', 1), ''),
      CASE 
        WHEN (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id) IS NOT NULL 
             AND position(' ' in (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id)) > 0 
        THEN substr((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id), 
                   position(' ' in (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id)) + 1) 
        ELSE '' 
      END
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;
