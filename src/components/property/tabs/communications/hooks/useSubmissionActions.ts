import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UseMarkAsReadProps {
  submissionId: string;
  isRead: boolean;
  setSubmissions: any; // Added this prop to match usage
}

export interface UseSendResponseProps {
  propertyId: string;
  submissionId: string;
  message: string;
  selectedSubmission: any; // Added this prop to match usage
}

export const useSubmissionActions = () => {
  const markAsRead = async ({ submissionId, isRead, setSubmissions }: UseMarkAsReadProps) => {
    try {
      const { error } = await supabase
        .from("property_contact_submissions")
        .update({ is_read: isRead })
        .eq("id", submissionId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Submission marked as ${isRead ? "read" : "unread"}`,
      });

      setSubmissions((prevSubmissions: any) =>
        prevSubmissions.map((submission: any) =>
          submission.id === submissionId ? { ...submission, is_read: isRead } : submission
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendResponse = async ({
    propertyId,
    submissionId,
    message,
    selectedSubmission,
  }: UseSendResponseProps) => {
    try {
      const { data: reply, error } = await supabase.from("submission_replies").insert({
        submission_id: submissionId,
        text: message,
        user_id: supabase.auth.user()?.id,
      }).single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Response sent successfully",
      });

      selectedSubmission.replies = [...(selectedSubmission.replies || []), reply];
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { markAsRead, sendResponse };
};
