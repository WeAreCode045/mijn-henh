
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissions } from "../communications/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface CommunicationsTabContentProps {
  id: string;
  title: string;
}

export function CommunicationsTabContent({ id, title }: CommunicationsTabContentProps) {
  const { toast } = useToast();
  const {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    handleMarkAsRead,
    handleSendResponse,
    refreshSubmissions
  } = useSubmissions(id);

  // Refresh submissions when component mounts
  useEffect(() => {
    refreshSubmissions();
  }, []);

  const handleSendResponseWrapper = async (responseText: string) => {
    try {
      await handleSendResponse(responseText);
      toast({
        title: "Response sent",
        description: "Your response has been sent successfully."
      });
    } catch (error) {
      console.error("Error sending response:", error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    }
  };

  console.log("Communications tab content for property:", id);
  console.log("Submissions:", submissions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <SubmissionsList 
          submissions={submissions} 
          isLoading={isLoading} 
          selectedSubmission={selectedSubmission} 
          onSelectSubmission={setSelectedSubmission}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>

      <div className="md:col-span-2">
        <SubmissionDetail 
          submission={selectedSubmission} 
          onMarkAsRead={handleMarkAsRead}
          onSendResponse={handleSendResponseWrapper}
        />
      </div>
    </div>
  );
}
