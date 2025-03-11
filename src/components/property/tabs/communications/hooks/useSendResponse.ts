
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSendResponse(submissionId: string, agentId: string, onSuccess?: () => void) {
  const [isSending, setIsSending] = useState(false);

  const sendResponse = async (responseText: string) => {
    if (!responseText.trim()) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          agent_id: agentId,
          reply_text: responseText
        });

      if (error) throw error;
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendResponse = sendResponse; // Alias for consistent API

  return {
    sendResponse,
    handleSendResponse,
    isSending
  };
}
