
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export interface UseMarkAsReadProps {
  propertyId?: string;
}

export interface UseSendResponseProps {
  propertyId?: string;
}

export function useSubmissionActions() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const markAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) throw error;

      toast({
        description: "Marked as read",
      });

      return true;
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        variant: "destructive",
        description: "Failed to mark as read",
      });
      return false;
    }
  };

  const sendResponse = async (submissionId: string, text: string) => {
    setIsSending(true);
    try {
      // Ensure user is authenticated
      const authUser = supabase.auth.getUser();
      if (!authUser) throw new Error("Not authenticated");

      // Insert reply to property_submission_replies table
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          user_id: profile.id,
          reply_text: text
        });

      if (error) throw error;

      toast({
        description: "Response sent successfully",
      });
      setIsSending(false);
      return true;
    } catch (error) {
      console.error("Error sending response:", error);
      toast({
        variant: "destructive",
        description: "Failed to send response",
      });
      setIsSending(false);
      return false;
    }
  };

  return { markAsRead, sendResponse, isSending };
}
