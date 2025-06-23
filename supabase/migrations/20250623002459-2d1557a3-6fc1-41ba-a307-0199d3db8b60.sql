
-- Find participant accounts without corresponding participant profiles and create them
INSERT INTO public.participants_profile (id, email, first_name, last_name)
SELECT 
    a.user_id,
    a.email,
    COALESCE(split_part((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = a.user_id), ' ', 1), '') as first_name,
    CASE 
        WHEN (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = a.user_id) IS NOT NULL 
             AND position(' ' in (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = a.user_id)) > 0 
        THEN substr((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = a.user_id), 
                   position(' ' in (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = a.user_id)) + 1) 
        ELSE '' 
    END as last_name
FROM public.accounts a
WHERE a.type = 'participant' 
AND NOT EXISTS (
    SELECT 1 FROM public.participants_profile p WHERE p.id = a.user_id
)
ON CONFLICT (id) DO NOTHING;

-- Show the accounts that were processed
SELECT 
    a.user_id,
    a.email,
    a.display_name,
    CASE WHEN p.id IS NOT NULL THEN 'Profile exists' ELSE 'Profile missing' END as profile_status
FROM public.accounts a
LEFT JOIN public.participants_profile p ON p.id = a.user_id
WHERE a.type = 'participant'
ORDER BY a.created_at DESC;
