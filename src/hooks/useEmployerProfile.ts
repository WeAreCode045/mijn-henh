
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface EmployerProfileData {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  avatar_url?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useEmployerProfile(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['employer-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Check if user has admin or agent role in accounts table
      const { data: roleData, error: roleError } = await supabase
        .from('accounts')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'agent'])
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error checking user role:', roleError);
        throw roleError;
      }

      // Only proceed if user is an admin or agent
      if (!roleData) {
        console.log("User is not an admin or agent");
        return null;
      }

      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching employer profile:', error);
        
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        
        throw error;
      }

      return data as EmployerProfileData;
    },
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<EmployerProfileData>) => {
      if (!userId) throw new Error('User ID is required');

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('employer_profiles')
          .update(profileData)
          .eq('id', userId)
          .select('*')
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from('employer_profiles')
          .insert({ id: userId, ...profileData })
          .select('*')
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['employer-profile', userId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
  };
}
