
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface UseSendResponseProps {
  submissionId: string;
  agentId: string;
  propertyId: string;
  onSuccess?: () => void;
}

export function useSendResponse({ 
  submissionId, 
  agentId,
  propertyId,
  onSuccess 
}: UseSendResponseProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendResponse = async (text: string) => {
    if (!submissionId || !text.trim()) {
      toast({
        title: "Error",
        description: "Missing submission ID or reply text",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // First, save the reply in the database
      const { error: dbError } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: text,
          user_id: agentId
        });

      if (dbError) throw dbError;

      // Then try to send via Edge Function if available
      try {
        const { error: fnError } = await supabase.functions.invoke('send-submission-reply', {
          body: {
            submissionId,
            replyText: text,
            propertyId
          }
        });

        if (fnError) {
          console.warn('Edge function error (continuing):', fnError);
          // We continue even if edge function fails since we saved to DB
        }
      } catch (edgeFnError) {
        console.warn('Edge function error (continuing):', edgeFnError);
        // We continue even if edge function fails since we saved to DB
      }

      // Mark the submission as read
      const { error: readError } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (readError) {
        console.warn('Error marking as read (continuing):', readError);
      }

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
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
