
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useProfileFetch() {
  const fetchUserProfile = useCallback(async (userId: string, role: string, email: string | undefined) => {
    console.log('Fetching profile for', userId, role, email);
    
    if (role === 'admin' || role === 'agent') {
      const { data: employerProfile, error: profileError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching employer profile:', profileError);
        return null;
      }

      if (employerProfile) {
        console.log('Found employer profile:', employerProfile);
        const fullName = `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim();
        return {
          id: userId,
          role: role,
          email: employerProfile.email || email,
          first_name: employerProfile.first_name || '',
          last_name: employerProfile.last_name || '',
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: employerProfile.avatar_url || undefined,
          phone: employerProfile.phone,
          whatsapp_number: employerProfile.whatsapp_number
        } as AppUser;
      } else {
        console.log('No employer profile found, creating new one');
        // If no profile exists yet, create a basic one
        try {
          const firstName = email ? email.split('@')[0] : '';
          
          const { data: newProfile, error: createError } = await supabase
            .from('employer_profiles')
            .insert({
              id: userId,
              email: email,
              first_name: firstName,
              last_name: ''
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating employer profile:', createError);
            return null;
          }
          
          if (newProfile) {
            return {
              id: userId,
              role: role,
              email: email,
              first_name: firstName,
              last_name: '',
              full_name: email ? email.split('@')[0] : 'Unknown',
              avatar_url: undefined,
              phone: null,
              whatsapp_number: null
            } as AppUser;
          }
        } catch (err) {
          console.error('Error in profile creation fallback:', err);
        }
      }
    } else if (role === 'buyer' || role === 'seller') {
      const { data: participantProfile, error: profileError } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching participant profile:', profileError);
        return null;
      }

      if (participantProfile) {
        const fullName = `${participantProfile.first_name || ''} ${participantProfile.last_name || ''}`.trim();
        return {
          id: userId,
          role: role,
          email: participantProfile.email || email,
          first_name: participantProfile.first_name || '',
          last_name: participantProfile.last_name || '',
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: undefined,
          phone: participantProfile.phone,
          whatsapp_number: participantProfile.whatsapp_number
        } as AppUser;
      }
    }
    
    console.log('No profile found and could not create one');
    return null;
  }, []);

  return { fetchUserProfile };
}
