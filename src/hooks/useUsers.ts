
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, refetch, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users in useUsers hook");
      try {
        // Get the user profiles directly from employer_profiles for admin/agent users
        const { data: profiles, error: profilesError } = await supabase
          .from("employer_profiles")
          .select(`
            id,
            email,
            first_name,
            last_name,
            phone,
            whatsapp_number,
            avatar_url,
            address,
            city,
            postal_code,
            country,
            created_at,
            updated_at
          `);

        if (profilesError) {
          console.error("Error fetching employer profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Employer profiles from supabase:", profiles);
        
        if (!profiles || profiles.length === 0) {
          console.log("No profiles found in database");
          return [];
        }

        // Now get the role information from accounts table
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select(`
            user_id,
            role
          `)
          .in('role', ['admin', 'agent']);

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw accountsError;
        }

        console.log("Account roles from supabase:", accountsData);

        // Create a map of user_id to role
        const roleMap = new Map();
        accountsData?.forEach(account => {
          roleMap.set(account.user_id, account.role);
        });

        // Map profiles to User type with role information
        const transformedData: User[] = profiles
          .filter(profile => roleMap.has(profile.id)) // Only include profiles with admin/agent roles
          .map(profile => {
            const role = roleMap.get(profile.id);
            return {
              id: profile.id,
              email: profile.email || '',
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              phone: profile.phone || '',
              whatsapp_number: profile.whatsapp_number || '',
              role: role,
              avatar_url: profile.avatar_url || '',
              // Include these properties conditionally if they exist in the UserBase type
              ...(profile.address && { address: profile.address }),
              ...(profile.city && { city: profile.city }),
              ...(profile.postal_code && { postal_code: profile.postal_code }),
              ...(profile.country && { country: profile.country }),
              created_at: profile.created_at || '',
              updated_at: profile.updated_at || ''
            };
          });

        console.log("Transformed users:", transformedData);
        return transformedData;
      } catch (err) {
        console.error("Error in useUsers query function:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    users: users || [],
    refetch,
    deleteUser,
    isLoading,
    error
  };
}
