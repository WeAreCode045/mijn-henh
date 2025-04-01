
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseDeleteSubmissionItemProps {
  onSuccess?: () => void;
}

export function useDeleteSubmissionItem({ onSuccess }: UseDeleteSubmissionItemProps = {}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteSubmission = async (id: string) => {
    setIsDeleting(true);
    try {
      // First delete all replies to this submission
      const { error: replyDeleteError } = await supabase
        .from('property_submission_replies')
        .delete()
        .eq('submission_id', id);

      if (replyDeleteError) {
        throw replyDeleteError;
      }

      // Then delete the submission itself
      const { error: submissionDeleteError } = await supabase
        .from('property_contact_submissions')
        .delete()
        .eq('id', id);

      if (submissionDeleteError) {
        throw submissionDeleteError;
      }

      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteReply = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('property_submission_replies')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Reply deleted successfully",
      });

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSubmission,
    deleteReply,
    isDeleting
  };
}
