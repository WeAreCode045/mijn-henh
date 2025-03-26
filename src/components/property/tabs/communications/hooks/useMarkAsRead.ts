import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
// Make sure to get the logPropertyChange function
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useMarkAsRead() {
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const markAsRead = async (propertyId: string, submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      // Use the function in the marked as read handler
      await logPropertyChange(propertyId, "submission", `Marked submission ${submissionId} as read`);

      toast({
        title: "Success",
        description: "Submission marked as read.",
      });
    } catch (error) {
      console.error("Error marking submission as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark submission as read.",
        variant: "destructive",
      });
    }
  };

  return { markAsRead };
}
