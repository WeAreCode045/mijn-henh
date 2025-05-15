
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async ({ propertyId, submissionId }: { propertyId: string, submissionId: string }) => {
      const { data, error } = await supabase
        .from("property_contact_submissions")
        .update({ is_read: true })
        .eq("id", submissionId)
        .eq("property_id", propertyId);
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["property-submissions", variables.propertyId]
      });
    }
  });

  const markAsRead = (propertyId: string, submissionId: string) => {
    mutation.mutate({ propertyId, submissionId });
  };

  return {
    markAsRead,
    isLoading: mutation.isPending,
    error: mutation.error
  };
}
