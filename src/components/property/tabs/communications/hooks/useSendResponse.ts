
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseSendResponseProps {
  submissionId: string;
  onSuccess?: () => void;
}

export function useSendResponse({ submissionId, onSuccess }: UseSendResponseProps = { submissionId: '' }) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendResponse = async (text: string) => {
    if (!submissionId || !text.trim()) return;
    
    setIsSending(true);
    try {
      // First, get the current user (agent)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Add reply to database
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          agent_id: user.id,
          reply_text: text.trim()
        });
        
      if (error) throw error;
      
      // Update submission to mark as read
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
      
      toast({
        title: 'Response sent',
        description: 'Your response has been sent successfully',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: 'Error',
        description: 'Failed to send response',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return { sendResponse, isSending };
}
