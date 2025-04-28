
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

export function useUsers() {
  const { toast } = useToast();

  const { data: users, refetch, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users in useUsers hook");
      try {
        // Query from both employer_profiles and accounts for admin/agent users
        const { data: employerData, error: employerError } = await supabase
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
            updated_at,
            accounts!inner(role)
          `)
          .order("created_at", { ascending: false });

        if (employerError) {
          console.error("Error fetching employer profiles:", employerError);
          throw employerError;
        }
        
        console.log("Employer profiles data from supabase:", employerData);
        
        if (!employerData || employerData.length === 0) {
          console.log("No users found in database");
          return [];
        }
        
        // Transform the data to match the User type
        const transformedData: User[] = employerData.map(profile => {
          // Get the role from the accounts relation
          const userAccount = Array.isArray(profile.accounts) ? profile.accounts[0] : profile.accounts;
          const role = userAccount?.role || 'agent';
          
          return {
            id: profile.id,
            email: profile.email || '',
            full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            phone: profile.phone || '',
            whatsapp_number: profile.whatsapp_number || '',
            role: role,
            avatar_url: profile.avatar_url || '',
            address: profile.address || '',
            city: profile.city || '',
            postal_code: profile.postal_code || '',
            country: profile.country || '',
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
