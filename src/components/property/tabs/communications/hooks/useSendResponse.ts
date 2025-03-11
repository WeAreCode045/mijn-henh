
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSendResponseOptions {
  submissionId: string;
  onSuccess: () => Promise<void>;
}

export function useSendResponse({ submissionId, onSuccess }: UseSendResponseOptions) {
  const [isSending, setIsSending] = useState(false);

  const sendResponse = async (replyText: string) => {
    if (!submissionId || !replyText.trim()) {
      console.error('Missing submission ID or reply text');
      return;
    }

    setIsSending(true);
    try {
      // Get current user info (agent)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Insert reply
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: replyText,
          agent_id: user.id
        });

      if (error) {
        throw error;
      }

      // Mark the submission as read
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      await onSuccess();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  return { sendResponse, isSending };
}
