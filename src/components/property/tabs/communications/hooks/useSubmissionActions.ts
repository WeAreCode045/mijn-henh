
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useSubmissionActions() {
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const archiveSubmission = async (propertyId: string, submissionId: string, isArchived: boolean) => {
    try {
      setIsArchiving(true);
      
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_archived: isArchived })
        .eq('id', submissionId);

      if (error) throw error;
      
      await logPropertyChange(
        propertyId, 
        "submission", 
        isArchived 
          ? `Archived submission ${submissionId}` 
          : `Unarchived submission ${submissionId}`
      );
      
      toast({
        title: "Success",
        description: isArchived 
          ? "Submission archived successfully" 
          : "Submission unarchived successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating submission archive status:", error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsArchiving(false);
    }
  };

  return {
    isArchiving,
    archiveSubmission
  };
}
