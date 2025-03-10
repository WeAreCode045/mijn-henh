
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseMarkAsReadOptions {
  submission_id: string;
  is_read: boolean;
  onSuccess?: () => void;
}

export const useMarkAsRead = ({ submission_id, is_read, onSuccess }: UseMarkAsReadOptions) => {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const markAsRead = async () => {
    if (!submission_id) return;
    
    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !is_read })
        .eq('id', submission_id);
        
      if (error) throw error;
      
      toast({
        description: `Submission marked as ${!is_read ? 'read' : 'unread'}`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to update submission status'
      });
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
};
