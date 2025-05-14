
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/user';

export function useProfileFetch() {
  const fetchUserProfile = useCallback(async (userId: string, type: string, email: string | undefined) => {
    console.log('Fetching profile for', userId, type, email);
    
    // First check the accounts table for the user role
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('role, type')
      .eq('id', userId)
      .maybeSingle();
    
    let userRole = null;
    let userType = type;
    
    if (accountError && accountError.code !== 'PGRST116') {
      console.error('Error fetching account data by id:', accountError);
      
      // Try by user_id as a fallback
      const { data: accountByUserId, error: userIdError } = await supabase
        .from('accounts')
        .select('role, type')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (userIdError && userIdError.code !== 'PGRST116') {
        console.error('Error fetching account data by user_id:', userIdError);
      } else if (accountByUserId) {
        console.log('Found account by user_id:', accountByUserId);
        userRole = accountByUserId.role;
        userType = accountByUserId.type || type;
      }
    } else if (accountData) {
      console.log('Found account:', accountData);
      userRole = accountData.role;
      userType = accountData.type || type;
    }
    
    // Use the determined type for fetching the correct profile
    if (userType === 'employee') {
      const { data: employerProfile, error: profileError } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching employer profile:', profileError);
        return createMinimalProfile(userId, userType, email, userRole);
      }

      if (employerProfile) {
        console.log('Found employer profile:', employerProfile);
        return createEmployerProfile(userId, employerProfile, email, userRole);
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
              role: userRole
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating employer profile:', createError);
            return createMinimalProfile(userId, userType, email, userRole);
          }
          
          if (newProfile) {
            return createEmployerProfile(userId, newProfile, email, userRole);
          }
        } catch (err) {
          console.error('Error in profile creation fallback:', err);
          return createMinimalProfile(userId, userType, email, userRole);
        }
      }
    } else if (userType === 'participant') {
      const { data: participantProfile, error: profileError } = await supabase
        .from('participants_profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching participant profile:', profileError);
        return createMinimalProfile(userId, userType, email, userRole);
      }

      if (participantProfile) {
        const fullName = `${participantProfile.first_name || ''} ${participantProfile.last_name || ''}`.trim();
        return {
          id: userId,
          type: userType,
          email: participantProfile.email || email || '',
          first_name: participantProfile.first_name || '',
          last_name: participantProfile.last_name || '',
          full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          display_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
          avatar_url: undefined,
          phone: participantProfile.phone || '',
          whatsapp_number: participantProfile.whatsapp_number || '',
          role: participantProfile.role || userRole || (userType === 'participant' ? 'buyer' : 'agent')
        } as AppUser;
      }
    }
    
    return createMinimalProfile(userId, userType, email, userRole);
  }, []);

  // Helper function to create a minimal profile with consistent structure
  function createMinimalProfile(userId: string, type: string, email: string | undefined, role: string | null): AppUser {
    const defaultRole = type === 'employee' ? 'agent' : 'buyer';
    console.log('Creating minimal profile with role:', role || defaultRole);
    return {
      id: userId,
      type: type,
      email: email || '',
      role: role || defaultRole
    } as AppUser;
  }

  // Helper function to create an employer profile with consistent structure
  function createEmployerProfile(userId: string, profile: any, email: string | undefined, role: string | null): AppUser {
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    const userRole = role || profile.role || 'agent';
    console.log('Creating employer profile with role:', userRole);
    return {
      id: userId,
      type: 'employee',
      email: profile.email || email || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      full_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
      display_name: fullName || (email ? email.split('@')[0] : 'Unknown'),
      avatar_url: profile.avatar_url || undefined,
      phone: profile.phone || '',
      whatsapp_number: profile.whatsapp_number || '',
      role: userRole
    } as AppUser;
  }

  return { fetchUserProfile };
}
