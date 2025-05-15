
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UseDeleteSubmissionItemProps {
  onSuccess?: () => void;
}

export function useDeleteSubmissionItem({ onSuccess }: UseDeleteSubmissionItemProps = {}) {
  const { toast } = useToast();

  // Mutation for deleting a submission
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from("property_contact_submissions")
        .delete()
        .eq("id", submissionId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Submission deleted",
        description: "The submission has been successfully deleted",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete submission: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a reply
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const { error } = await supabase
        .from("property_submission_replies")
        .delete()
        .eq("id", replyId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reply deleted",
        description: "The reply has been successfully deleted",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete reply: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    deleteSubmission: (submissionId: string) => deleteSubmissionMutation.mutateAsync(submissionId),
    deleteReply: (replyId: string) => deleteReplyMutation.mutateAsync(replyId),
    isDeleting: deleteSubmissionMutation.isPending || deleteReplyMutation.isPending
  };
}
