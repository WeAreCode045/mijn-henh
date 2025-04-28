
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useProfileFetch() {
  const fetchUserProfile = useCallback(async (userId: string, role: string, email: string) => {
    if (role === 'admin' || role === 'agent') {
      const { data: employerProfile, error: profileError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching employer profile:', profileError);
        return null;
      }

      if (employerProfile) {
        const fullName = `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim();
        return {
          id: userId,
          role: role,
          email: employerProfile.email || email,
          full_name: fullName || email.split('@')[0],
          avatar_url: employerProfile.avatar_url || undefined,
          phone: employerProfile.phone,
          whatsapp_number: employerProfile.whatsapp_number
        } as AppUser;
      }
    } else if (role === 'buyer' || role === 'seller') {
      const { data: participantProfile, error: profileError } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', userId)
        .single();

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
          full_name: fullName || email.split('@')[0],
          avatar_url: undefined,
          phone: participantProfile.phone,
          whatsapp_number: participantProfile.whatsapp_number
        } as AppUser;
      }
    }
    return null;
  }, []);

  return { fetchUserProfile };
}
