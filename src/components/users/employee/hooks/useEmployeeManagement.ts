
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface EmployeeData {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  role?: string | null;
  type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useEmployeeManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading, error, refetch } = useQuery<EmployeeData[]>({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching employees in useEmployeeManagement hook");
      
      try {
        // First get all accounts with employee type
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('type', 'employee');

        if (accountsError) {
          console.error("Error fetching employee accounts:", accountsError);
          throw accountsError;
        }
        
        console.log("Employee accounts data from supabase:", accountsData);
        
        if (!accountsData || accountsData.length === 0) {
          console.log("No accounts found with employee type");
          return [];
        }
        
        // Create a map of user ids
        const userIds = accountsData.map(account => account.user_id);
        
        // Fetch employee profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("employer_profiles")
          .select("*")
          .in("id", userIds);
          
        if (profilesError) {
          console.error("Error fetching employer profiles:", profilesError);
          throw profilesError;
        }
        
        // Create a map for quick lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Map the data with profiles
        return accountsData.map(account => {
          const profile = profileMap.get(account.id);
          
          return {
            id: account.id,
            email: account.email || profile?.email || null,
            first_name: profile?.first_name ?? null,
            last_name: profile?.last_name ?? null,
            full_name: account.display_name || 
              [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() || 
              'Unnamed Employee',
            display_name: account.display_name,
            phone: profile?.phone ?? null,
            whatsapp_number: profile?.whatsapp_number ?? null,
            role: profile?.role || account.role || 'agent',
            type: account.type || 'employee',
            created_at: profile?.created_at ?? account.created_at,
            updated_at: profile?.updated_at ?? account.updated_at,
          };
        });
      } catch (error) {
        console.error("Error in useEmployeeManagement:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Employee Deleted',
        description: 'The employee has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    deleteEmployee: deleteEmployee.mutate,
  };
}
