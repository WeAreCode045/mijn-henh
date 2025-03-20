
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useSendResponse({ 
  submissionId, 
  agentId, 
  propertyId, 
  onSuccess
}: { 
  submissionId: string; 
  agentId: string; 
  propertyId: string;
  onSuccess?: () => void;
}) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

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
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          agent_id: agentId,
          reply_text: responseText
        });

      if (error) throw error;

      // Log the submission reply
      if (propertyId) {
        // Get agent name for better logging
        let agentName = "Unknown agent";
        if (agentId) {
          const { data: agentData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', agentId)
            .single();
            
          agentName = agentData?.full_name || "Unknown agent";
        }
        
        await logPropertyChange(
          propertyId,
          "submission_reply",
          "",
          `Response sent by ${agentName}`
        );
      }

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

  return {
    sendResponse,
    isSending
  };
}
