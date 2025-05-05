
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const isAuthenticated = !!session;

  const { data: users, refetch, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users in useUsers hook");
      
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping fetch");
        return [];
      }
      
      try {
        // First get all employer profiles
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
          throw new Error(`Failed to fetch employer profiles: ${profilesError.message}`);
        }
        
        console.log("Employer profiles from supabase:", profiles);
        
        if (!profiles || profiles.length === 0) {
          console.log("No employer profiles found");
          return [];
        }

        // Then get all accounts with admin or agent roles
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('user_id, role')
          .in('role', ['admin', 'agent']);

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
        }

        console.log("Admin/agent accounts data from supabase:", accountsData);

        // Create a map of user_id to role
        const roleMap = new Map();
        accountsData?.forEach(account => {
          roleMap.set(account.user_id, account.role);
        });

        // Filter profiles to only include those with admin or agent roles
        const employeeProfiles = profiles
          .filter(profile => roleMap.has(profile.id))
          .map(profile => ({
            id: profile.id,
            email: profile.email || '',
            full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed User',
            phone: profile.phone || '',
            whatsapp_number: profile.whatsapp_number || '',
            role: roleMap.get(profile.id) || 'agent',
            avatar_url: profile.avatar_url || '',
            address: profile.address || '',
            city: profile.city || '',
            postal_code: profile.postal_code || '',
            country: profile.country || '',
            created_at: profile.created_at || '',
            updated_at: profile.updated_at || ''
          }));

        console.log("Transformed employee profiles:", employeeProfiles);
        return employeeProfiles;
      } catch (err) {
        console.error("Error in useUsers query function:", err);
        throw err;
      }
    },
    enabled: isAuthenticated
  });

  const deleteUser = async (userId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in to delete users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // First delete from accounts table
      const { error: accountError } = await supabase
        .from('accounts')
        .delete()
        .eq('user_id', userId);
      
      if (accountError) {
        console.error("Error deleting from accounts:", accountError);
        throw accountError;
      }
      
      // Then delete from employer_profiles
      const { error: profileError } = await supabase
        .from('employer_profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error("Error deleting from employer_profiles:", profileError);
        throw profileError;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error: any) {
      console.error("Error in deleteUser:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return {
    users: users || [],
    refetch,
    deleteUser,
    isLoading,
    error,
    isAuthenticated
  };
}
