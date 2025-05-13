
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
        // Get all accounts with employee type
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('type', 'employee');

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
        }

        console.log("Employee accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No employee accounts found");
          return [];
        }
        
        // Fetch employer profiles for these account IDs
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
            role,
            created_at,
            updated_at
          `)
          .in('id', accountsData.map(account => account.id));

        if (profilesError) {
          console.error("Error fetching employer profiles:", profilesError);
          throw new Error(`Failed to fetch employer profiles: ${profilesError.message}`);
        }
        
        console.log("Employer profiles from supabase:", profiles);

        // Create a map of id to profile
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Map accounts to user profiles
        const employeeProfiles = accountsData.map(account => {
          const profile = profileMap.get(account.id) || {};
          
          return {
            id: account.id,
            email: profile.email || account.email || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || account.display_name || 'Unnamed User',
            display_name: account.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed User',
            phone: profile.phone || '',
            whatsapp_number: profile.whatsapp_number || '',
            type: account.type || 'employee',
            role: profile.role || account.role || 'agent',
            avatar_url: profile.avatar_url || '',
            address: profile.address || '',
            city: profile.city || '',
            postal_code: profile.postal_code || '',
            country: profile.country || '',
            created_at: profile.created_at || '',
            updated_at: profile.updated_at || ''
          };
        });

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
      // Delete from accounts (this should cascade to employer_profiles)
      const { error: accountError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', userId);
      
      if (accountError) {
        console.error("Error deleting from accounts:", accountError);
        throw accountError;
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
