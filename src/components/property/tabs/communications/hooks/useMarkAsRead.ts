
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "../types";

interface UseMarkAsReadProps {
  setSubmissions: (updater: (prevSubmissions: Submission[]) => Submission[]) => void;
  setSelectedSubmission: (submission: Submission | null) => void;
  toast: any;
}

export function useMarkAsRead({ 
  setSubmissions, 
  setSelectedSubmission, 
  toast 
}: UseMarkAsReadProps) {
  
  const handleMarkAsRead = async (submissionId: string) => {
    try {
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      setSubmissions(subs => 
        subs.map(sub => sub.id === submissionId ? { ...sub, is_read: true } : sub)
      );
      
      setSelectedSubmission(prev => 
        prev && prev.id === submissionId ? { ...prev, is_read: true } : prev
      );

      toast({
        title: 'Marked as read',
        description: 'The submission has been marked as read',
      });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark submission as read',
        variant: 'destructive',
      });
    }
  };

  return { handleMarkAsRead };
}
