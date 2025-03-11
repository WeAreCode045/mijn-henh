
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSendResponse(submissionId: string, agentId: string, onSuccess?: () => void) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendResponse = async (responseText: string) => {
    if (!responseText.trim()) {
      toast({
        title: "Error",
        description: "Response text cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('submission_replies')
        .insert({
          submission_id: submissionId,
          agent_id: agentId,
          message: responseText
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response sent successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Renamed to handleSendResponse for consistency
  const handleSendResponse = sendResponse;

  return {
    sendResponse,
    handleSendResponse,
    isSending
  };
}
