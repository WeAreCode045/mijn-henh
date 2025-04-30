
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
        // Query from accounts table to get admin/agent users
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select(`
            id,
            user_id,
            role,
            email,
            status
          `)
          .in('role', ['admin', 'agent'])
          .order("created_at", { ascending: false });

        if (accountsError) {
          console.error("Error fetching accounts:", accountsError);
          throw accountsError;
        }
        
        console.log("Accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No users found in database");
          return [];
        }
        
        // For each account, fetch the profile information
        const transformedData: User[] = [];
        
        for (const account of accountsData) {
          // Get employer profile for each user
          const { data: profile, error: profileError } = await supabase
            .from("employer_profiles")
            .select("*")
            .eq("id", account.user_id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error(`Error fetching profile for user ${account.user_id}:`, profileError);
            continue;
          }
          
          // Create user object combining account and profile data
          transformedData.push({
            id: account.user_id,
            email: profile?.email || account.email || '',
            full_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
            phone: profile?.phone || '',
            whatsapp_number: profile?.whatsapp_number || '',
            role: account.role,
            avatar_url: profile?.avatar_url || '',
            address: profile?.address || '',
            city: profile?.city || '',
            postal_code: profile?.postal_code || '',
            country: profile?.country || '',
            created_at: account.created_at || '',
            updated_at: profile?.updated_at || ''
          });
        }

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
