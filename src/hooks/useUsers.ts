
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function useUsers() {
  const { toast } = useToast();

  const { data: users, refetch, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users in useUsers hook");
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
          throw error;
        }
        
        console.log("Users data from supabase:", data);
        
        if (!data || data.length === 0) {
          console.log("No users found in database");
          return [];
        }
        
        // Transform the data to match the User type
        const transformedData: User[] = (data as ProfileRow[]).map(user => ({
          id: user.id,
          email: user.email || null,
          full_name: user.full_name || null,
          phone: user.phone || null,
          whatsapp_number: user.whatsapp_number || null,
          role: user.role as "admin" | "agent" | "seller" | "buyer" | null,
          avatar_url: user.avatar_url || null,
          address: user.address || null,
          city: user.city || null,
          postal_code: user.postal_code || null,
          country: user.country || null
        }));

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
