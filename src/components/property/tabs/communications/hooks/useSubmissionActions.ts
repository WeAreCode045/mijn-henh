
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseMarkAsReadProps {
  submissionId: string;
  isRead: boolean;
  onSuccess?: () => void;
}

export const useMarkAsRead = ({ submissionId, isRead, onSuccess }: UseMarkAsReadProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const markAsRead = async () => {
    if (!submissionId) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !isRead })
        .eq('id', submissionId);
        
      if (error) throw error;
      
      toast({
        description: `Submission marked as ${!isRead ? 'read' : 'unread'}`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to update submission status'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { markAsRead, isUpdating };
};

export interface UseSendResponseProps {
  submissionId: string;
  onSuccess?: () => void;
}

export const useSendResponse = ({ submissionId, onSuccess }: UseSendResponseProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendResponse = async (text: string) => {
    if (!submissionId || !text.trim()) return;
    
    setIsSending(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: text,
          user_id: userData.user?.id
        });
        
      if (error) throw error;
      
      toast({
        description: 'Response sent successfully'
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to send response'
      });
    } finally {
      setIsSending(false);
    }
  };

  return { sendResponse, isSending };
};
