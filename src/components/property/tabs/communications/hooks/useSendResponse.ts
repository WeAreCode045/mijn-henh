
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface UseSendResponseProps {
  propertyId?: string;
  submissionId?: string;
  onSuccess?: () => void;
}

export function useSendResponse({ propertyId, submissionId, onSuccess }: UseSendResponseProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendResponse = async (responseText: string) => {
    if (!responseText.trim() || !submissionId) {
      toast({
        title: "Error",
        description: "Response cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: responseText,
          agent_id: userData.user?.id
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
}
