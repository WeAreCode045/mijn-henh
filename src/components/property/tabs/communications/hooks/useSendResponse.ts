
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export interface UseSendResponseOptions {
  submissionId: string;
  onSuccess: () => Promise<void>;
}

export function useSendResponse({ submissionId, onSuccess }: UseSendResponseOptions) {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendResponse = async (replyText: string) => {
    if (!submissionId || !replyText.trim()) {
      console.error('Missing submission ID or reply text');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: replyText,
          agent_id: user?.id
        });

      if (error) {
        throw error;
      }

      await onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSending(false);
    }
  };

  return { sendResponse, isSending };
}
