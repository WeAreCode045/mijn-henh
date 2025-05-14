
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useProfileFetch() {
  const fetchUserProfile = useCallback(async (userId: string, type: string, email: string | undefined) => {
    console.log('Fetching profile for', userId, type, email);
    
    if (type === 'employee') {
      // First check the accounts table for the user role
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error fetching account data by id:', accountError);
        
        // Try by user_id as a fallback
        const { data: accountByUserId, error: userIdError } = await supabase
          .from('accounts')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (userIdError && userIdError.code !== 'PGRST116') {
          console.error('Error fetching account data by user_id:', userIdError);
        } else if (accountByUserId) {
          console.log('Found account role by user_id:', accountByUserId.role);
        }
      } else if (accountData) {
        console.log('Found account role:', accountData.role);
      }
      
      const userRole = accountData?.role || 'agent';

      const { data: employerProfile, error: profileError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching employer profile:', profileError);
        return null;
      }

      if (employerProfile) {
        console.log('Found employer profile:', employerProfile);
        const fullName = `${employerProfile.first_name || ''} ${employerProfile.last_name || ''}`.trim();
        return {
          id: userId,
          type: type,
          email: employerProfile.email || email,
          first_name: employerProfile.first_name || '',
          last_name: employerProfile.last_name || '',
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          display_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: employerProfile.avatar_url || undefined,
          phone: employerProfile.phone,
          whatsapp_number: employerProfile.whatsapp_number,
          role: userRole // Use the role from accounts table instead of the profile
        } as AppUser;
      } else {
        console.log('No employer profile found, attempting to create one');
        // If no profile exists yet, create a basic one
        try {
          const firstName = email ? email.split('@')[0] : '';
          
          const { data: newProfile, error: createError } = await supabase
            .from('employer_profiles')
            .insert({
              id: userId,
              email: email,
              first_name: firstName,
              last_name: '',
              role: userRole // Use the role from accounts table
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating employer profile:', createError);
            return {
              id: userId,
              type: type,
              email: email || '',
              first_name: firstName,
              last_name: '',
              full_name: firstName,
              display_name: firstName,
              role: userRole // Use the role from accounts table
            } as AppUser;
          }
          
          if (newProfile) {
            return {
              id: userId,
              type: type,
              email: email || '',
              first_name: firstName,
              last_name: '',
              full_name: firstName,
              display_name: firstName,
              avatar_url: undefined,
              phone: null,
              whatsapp_number: null,
              role: userRole // Use the role from accounts table
            } as AppUser;
          }
        } catch (err) {
          console.error('Error in profile creation fallback:', err);
          // Return a minimal profile to prevent getting stuck
          return {
            id: userId,
            type: type,
            email: email || '',
            role: userRole // Use the role from accounts table
          } as AppUser;
        }
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
    
    // Check accounts table directly as a last resort
    const { data: accountInfo, error: accountQueryError } = await supabase
      .from('accounts')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    const userRole = accountInfo?.role || (type === 'employee' ? 'agent' : 'buyer');
    
    console.log('No profile found and could not create one, returning minimal user profile with role:', userRole);
    return {
      id: userId,
      type: type,
      email: email || '',
      role: userRole
    } as AppUser;
  }, []);

  return { fetchUserProfile };
}
