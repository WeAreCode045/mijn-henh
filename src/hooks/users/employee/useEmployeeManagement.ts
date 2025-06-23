import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";

// Define the type for the joined employer_profiles data
interface EmployerProfileData {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  whatsapp_number?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the type for account with joined profile
interface AccountWithProfile {
  id: string;
  user_id: string;
  role: string;
  type: string;
  email?: string;
  display_name?: string;
  created_at?: string;
  updated_at?: string;
  employer_profiles?: EmployerProfileData | null;
}

export function useEmployeeManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const isAuthenticated = !!session;

  const { data: users, refetch, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      console.log("Fetching employees in useEmployeeManagement hook");
      
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping fetch");
        return [];
      }
      
      try {
        // Get all employee accounts with their employer profiles in a single optimized query
        const { data: accountsWithProfiles, error: accountsError } = await supabase
          .from('accounts')
          .select(`
            id,
            user_id,
            role,
            type,
            email,
            display_name,
            created_at,
            updated_at,
            employer_profiles!fk_employer_profiles_user_id (
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
            )
          `)
          .eq('type', 'employee') as { data: AccountWithProfile[] | null, error: any };

        if (accountsError) {
          console.error("Error fetching accounts with profiles:", accountsError);
          throw new Error(`Failed to fetch employee data: ${accountsError.message}`);
        }

        console.log("Employee accounts with profiles from supabase:", accountsWithProfiles);
        
        if (!accountsWithProfiles || !Array.isArray(accountsWithProfiles) || accountsWithProfiles.length === 0) {
          console.log("No employee accounts found");
          return [];
        }

        // Get emails from auth.users for each user_id if needed
        const emailMap = new Map<string, string>();
        const userIds = accountsWithProfiles
          .filter(account => account && account.user_id)
          .map(account => account.user_id)
          .filter(Boolean);
          
        if (userIds && userIds.length > 0) {
          try {
            const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
              perPage: 1000
            });
            
            if (authError) {
              console.error("Error fetching user emails from auth.users:", authError);
            } else if (authData && authData.users) {
              const authUsers = Array.isArray(authData.users) ? authData.users : [];
              
              authUsers.forEach(user => {
                if (user && user.id && user.email) {
                  emailMap.set(user.id, user.email);
                }
              });
            }
          } catch (err) {
            console.error("Error fetching user emails from auth.users:", err);
          }
        }
        
        // Transform the data to User objects
        const employeeProfiles = [];
        
        for (const account of accountsWithProfiles) {
          if (!account) continue;
          
          // employer_profiles is now joined via foreign key relationship
          const profile = account.employer_profiles;
          
          // Get email from various sources (auth, profile, account)
          const userEmail = emailMap.get(account.user_id) || 
                           (profile?.email || '') || 
                           account.email || '';
          
          employeeProfiles.push({
            id: account.id, // This is the account.id
            user_id: account.user_id, // This is the auth user_id
            email: userEmail,
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            full_name: profile?.first_name && profile?.last_name 
              ? `${profile.first_name} ${profile.last_name}`.trim()
              : account.display_name || 'Unnamed User',
            display_name: account.display_name || 
              (profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`.trim()
                : '') || 'Unnamed User',
            phone: profile?.phone || '',
            whatsapp_number: profile?.whatsapp_number || '',
            type: account.type || 'employee',
            role: profile?.role || account.role || 'agent',
            avatar_url: profile?.avatar_url || '',
            created_at: profile?.created_at || account.created_at || '',
            updated_at: profile?.updated_at || account.updated_at || ''
          });
        }

        console.log("Transformed employee profiles:", employeeProfiles);
        return employeeProfiles;
      } catch (err) {
        console.error("Error in useEmployeeManagement query function:", err);
        throw err;
      }
    },
    enabled: isAuthenticated,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!isAuthenticated) {
        toast({
          title: "Error",
          description: "You must be logged in to delete users",
          variant: "destructive",
        });
        return;
      }
      
      try {
        // Delete from accounts (this will cascade to employer_profiles due to FK constraint)
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
  
        return;
      } catch (error: any) {
        console.error("Error in deleteUser:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    users,
    refetch,
    deleteUser: deleteUserMutation.mutate,
    isLoading,
    error,
    isAuthenticated,
  };
}
