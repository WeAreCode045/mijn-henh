import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

interface SubmissionActionsProps {
  propertyId: string;
  submissionId: string;
  onSuccess?: () => void;
}

export function useSubmissionActions({ propertyId, submissionId, onSuccess }: SubmissionActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const handleDeleteSubmission = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });

      await logPropertyChange(propertyId, "submission", `Deleted submission ${submissionId}`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveSubmission = async (isArchived: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ archived: isArchived })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Submission ${isArchived ? 'archived' : 'unarchived'} successfully`,
      });

      await logPropertyChange(propertyId, "submission", `Archived submission ${submissionId}`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error archiving submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to archive submission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDeleteSubmission,
    handleArchiveSubmission,
  };
}
