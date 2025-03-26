
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
    message: string
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("property_submission_replies")
        .insert({
          submission_id: submissionId,
          reply_text: message
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Response sent successfully.",
      });

      await logPropertyChange(propertyId, "submission", `Sent response to submission ${submissionId}`);
    } catch (error: any) {
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
