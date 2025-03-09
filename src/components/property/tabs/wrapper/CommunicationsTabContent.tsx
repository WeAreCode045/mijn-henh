
import { useState, useEffect } from "react";
import { useSubmissions } from "@/components/property/tabs/communications/useSubmissions";
import { useSendResponse } from "@/components/property/tabs/communications/hooks/useSendResponse";
import { useMarkAsRead } from "@/components/property/tabs/communications/hooks/useMarkAsRead";
import { SubmissionsList } from "@/components/property/tabs/communications/SubmissionsList";
import { SubmissionDetail } from "@/components/property/tabs/communications/SubmissionDetail";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Submission } from "@/components/property/tabs/communications/types";

interface CommunicationsTabContentProps {
  propertyId: string;
  agentId?: string;
}

export function CommunicationsTabContent({
  propertyId,
  agentId,
}: CommunicationsTabContentProps) {
  const { toast } = useToast();
  const {
    submissions,
    isLoading,
    totalSubmissions,
    setSubmissions,
    fetchSubmissions,
  } = useSubmissions(propertyId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  );

  useEffect(() => {
    if (submissions && submissions.length > 0 && !selectedSubmission) {
      setSelectedSubmission(submissions[0]);
    }
  }, [submissions, selectedSubmission]);

  const { sendResponse, isLoading: isSending } = useSendResponse({
    onSuccess: () => {
      toast({
        title: "Response sent",
        description: "Your response has been sent successfully",
      });
      fetchSubmissions();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send response",
        variant: "destructive",
      });
    },
  });

  const { markAsRead } = useMarkAsRead({
    onSuccess: (updatedSubmission) => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === updatedSubmission.id ? updatedSubmission : sub
        )
      );
      setSelectedSubmission((prev) =>
        prev?.id === updatedSubmission.id ? updatedSubmission : prev
      );
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark as read",
        variant: "destructive",
      });
    },
  });

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !agentId) return;
    
    await sendResponse({
      submissionId: selectedSubmission.id,
      replyText: responseText,
      agentId: agentId
    });
  };

  const handleMarkAsRead = async (submissionId: string) => {
    await markAsRead(submissionId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <SubmissionsList
          submissions={submissions}
          isLoading={isLoading}
          totalSubmissions={totalSubmissions}
          selectedSubmissionId={selectedSubmission?.id}
          onSubmissionClick={handleSubmissionClick}
        />
      </div>
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <SubmissionDetail 
            submission={selectedSubmission} 
            onMarkAsRead={handleMarkAsRead}
            onSendResponse={handleSendResponse}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {isLoading 
                ? "Loading submissions..." 
                : submissions.length === 0 
                  ? "No submissions found" 
                  : "Select a submission to view details"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
