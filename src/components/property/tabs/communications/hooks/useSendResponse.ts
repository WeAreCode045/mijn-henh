
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useSendResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const sendResponse = async (
    propertyId: string,
    submissionId: string,
    message: string,
    recipientEmail?: string // Added recipient email parameter
  ) => {
    setIsLoading(true);
    try {
      console.log("Sending response with recipientEmail:", recipientEmail);
      
      // First, insert the reply into the database
      const { error: dbError } = await supabase
        .from("property_submission_replies")
        .insert({
          submission_id: submissionId,
          reply_text: message
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      // Then try to send email using the Edge Function
      try {
        const { error: fnError } = await supabase.functions.invoke('send-submission-reply', {
          body: {
            submissionId,
            replyText: message,
            propertyId,
            recipientEmail // Pass recipient email to the edge function
          }
        });
        
        if (fnError) {
          console.warn('Edge function error:', fnError);
          // We continue even if edge function fails since we saved to DB
        }
      } catch (edgeFnError) {
        console.warn('Edge function error:', edgeFnError);
        // We continue even if edge function fails since we saved to DB
      }

      toast({
        title: "Success",
        description: "Response sent successfully.",
      });

      await logPropertyChange(propertyId, "submission", `Sent response to submission ${submissionId}`);
    } catch (error: any) {
      console.error("Send response error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendResponse,
    isLoading,
  };
}
