
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useProfileFetch() {
  const fetchUserProfile = useCallback(async (userId: string, type: string, email: string | undefined) => {
    console.log('Fetching profile for', userId, type, email);
    
    if (type === 'employee') {
      // Use the optimized query with the new FK relationship
      const { data: accountWithProfile, error: accountError } = await supabase
        .from('accounts')
        .select(`
          id,
          user_id,
          role,
          type,
          email,
          display_name,
          employer_profiles!fk_employer_profiles_user_id (
            id,
            email,
            first_name,
            last_name,
            phone,
            whatsapp_number,
            avatar_url,
            role
          )
        `)
        .eq('user_id', userId)
        .eq('type', 'employee')
        .maybeSingle();

      if (accountError) {
        console.error('Error fetching account with profile:', accountError);
        return null;
      }

      if (accountWithProfile) {
        const profile = accountWithProfile.employer_profiles;
        console.log('Found account with profile:', accountWithProfile);
        
        const firstName = profile?.first_name || '';
        const lastName = profile?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        return {
          id: accountWithProfile.id, // account.id
          user_id: accountWithProfile.user_id, // auth user_id
          type: type,
          email: profile?.email || accountWithProfile.email || email,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          display_name: accountWithProfile.display_name || fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: profile?.avatar_url || undefined,
          phone: profile?.phone,
          whatsapp_number: profile?.whatsapp_number,
          role: profile?.role || accountWithProfile.role
        } as AppUser;
      } else {
        console.log('No account found, creating new one');
        // If no account exists yet, we could create one here if needed
        // For now, just return null to let the calling code handle it
        return null;
      }
    } else if (type === 'participant') {
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
          user_id: userId,
          type: type,
          email: participantProfile.email || email,
          first_name: participantProfile.first_name || '',
          last_name: participantProfile.last_name || '',
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          display_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: undefined,
          phone: participantProfile.phone,
          whatsapp_number: participantProfile.whatsapp_number,
          role: participantProfile.role
        } as AppUser;
      }
    }
    
    console.log('No profile found');
    return null;
  }, []);

  return { fetchUserProfile };
}
