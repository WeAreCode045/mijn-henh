
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
        // First get all accounts with admin or agent roles
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select(`
            user_id,
            role,
            email
          `)
          .in('role', ['admin', 'agent']);

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw accountsError;
        }
        
        console.log("Accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No accounts found with admin or agent roles");
          return [];
        }
        
        // Extract user IDs from accounts
        const userIds = accountsData.map(account => account.user_id);
        
        // Get the user profiles from employer_profiles
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
          `)
          .in('id', userIds);

        if (profilesError) {
          console.error("Error fetching employer profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Employer profiles from supabase:", profiles);
        
        // Create a map of user_id to role
        const roleMap = new Map();
        accountsData.forEach(account => {
          roleMap.set(account.user_id, account.role);
        });

        // Map profiles to User type with role information
        const transformedData: User[] = profiles
          ? profiles.map(profile => {
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
            })
          : [];

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
      // First delete from employer_profiles (will cascade to accounts)
      const { error: profileError } = await supabase
        .from('employer_profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

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
