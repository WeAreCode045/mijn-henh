
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
        // Get all accounts with employee type - FIX: use correct column name
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('type', 'employee');

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
        }

        console.log("Employee accounts data from supabase:", accountsData);
        
        if (!accountsData || !Array.isArray(accountsData) || accountsData.length === 0) {
          console.log("No employee accounts found");
          return [];
        }

        // Create a map for emails
        const emailMap = new Map();
        
        // First try to get emails from the accounts table directly
        accountsData.forEach(account => {
          if (account && account.email) {
            emailMap.set(account.id, account.email);
            if (account.user_id) {
              emailMap.set(account.user_id, account.email);
            }
          }
        });
        
        // Get emails from auth.users for each user_id
        const userIds = accountsData
          .filter(account => account && account.user_id && !emailMap.has(account.user_id))
          .map(account => account.user_id)
          .filter(Boolean); // Remove any undefined or null values
          
        if (userIds && userIds.length > 0) {
          try {
            // Note: This might fail depending on permissions
            const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
              perPage: 1000
            });
            
            if (authError) {
              console.error("Error fetching user emails from auth.users:", authError);
              // Continue without these emails
            } else if (authData && authData.users) {
              authData.users.forEach(user => {
                if (user && user.id && user.email) {
                  emailMap.set(user.id, user.email);
                  
                  const matchingAccount = accountsData.find(acc => acc && acc.user_id === user.id);
                  if (matchingAccount) {
                    emailMap.set(matchingAccount.id, user.email);
                  }
                }
              });
            }
          } catch (err) {
            console.error("Error fetching user emails from auth.users:", err);
            // Continue without these emails
          }
        }
        
        // Fetch employer profiles for these account IDs
        const accountIds = accountsData
          .filter(account => account && account.id)
          .map(account => account.id)
          .filter(Boolean); // Remove any undefined values
          
        if (accountIds.length === 0) {
          return [];
        }
        
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
            role,
            created_at,
            updated_at
          `)
          .in('id', accountIds);

        if (profilesError) {
          console.error("Error fetching employer profiles:", profilesError);
          throw new Error(`Failed to fetch employer profiles: ${profilesError.message}`);
        }
        
        console.log("Employer profiles from supabase:", profiles);

        // Create a map of id to profile
        const profileMap = new Map();
        if (profiles && Array.isArray(profiles)) {
          profiles.forEach(profile => {
            if (profile) {
              profileMap.set(profile.id, profile);
            }
          });
        }
        
        // Map accounts to user profiles
        const employeeProfiles = accountsData.map(account => {
          if (!account) return null;
          
          const profile = profileMap.get(account.id) || {};
          
          // Get email from emailMap, profile, or fall back to empty string
          const userEmail = emailMap.get(account.id) || (profile ? profile.email : '') || '';
          
          return {
            id: account.id,
            email: userEmail,
            first_name: profile ? profile.first_name || '' : '',
            last_name: profile ? profile.last_name || '' : '',
            full_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : account.display_name || 'Unnamed User',
            display_name: account.display_name || (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') || 'Unnamed User',
            phone: profile ? profile.phone || '' : '',
            whatsapp_number: profile ? profile.whatsapp_number || '' : '',
            type: account.type || 'employee',
            role: profile ? profile.role || account.role || 'agent' : account.role || 'agent',
            avatar_url: profile ? profile.avatar_url || '' : '',
            created_at: profile ? profile.created_at || '' : '',
            updated_at: profile ? profile.updated_at || '' : ''
          };
        }).filter(Boolean); // Filter out any null values

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
