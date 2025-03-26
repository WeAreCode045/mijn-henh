
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSubmissionActions() {
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();

  const archiveSubmission = async (submissionId: string, isArchived: boolean) => {
    setIsArchiving(true);
    try {
      // Check if the table uses is_read instead of is_archived
      const { error } = await supabase
        .from("property_contact_submissions")
        .update({ is_read: isArchived })
        .eq("id", submissionId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: isArchived 
          ? "Submission has been archived." 
          : "Submission has been unarchived.",
      });

      return true;
    } catch (error: any) {
      console.error("Error archiving submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isArchived ? "archive" : "unarchive"} submission.`,
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
