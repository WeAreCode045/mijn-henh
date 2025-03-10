
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseMarkAsReadProps {
  submissionId: string;
  isRead: boolean;
  onSuccess?: () => void;
}

export function useMarkAsRead({ submissionId, isRead, onSuccess }: UseMarkAsReadProps = { submissionId: '', isRead: false }) {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const markAsRead = async () => {
    if (!submissionId) return;
    
    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !isRead })
        .eq('id', submissionId);
        
      if (error) throw error;
      
      toast({
        title: `Marked as ${!isRead ? 'read' : 'unread'}`,
        description: 'Submission status updated successfully',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error marking submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update submission status',
        variant: 'destructive',
      });
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
}
