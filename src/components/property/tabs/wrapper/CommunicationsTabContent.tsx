
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useSubmissions, Submission } from "../communications/useSubmissions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissionActions } from "../communications/hooks/useSubmissionActions";
import { useToast } from "@/components/ui/use-toast";

interface CommunicationsTabContentProps {
  property: {
    id: string;
    title: string;
  };
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { submissions, loading, error, fetchSubmissions } = useSubmissions(property.id);
  const { toast } = useToast();
  const { 
    markAsRead,
    sendResponse,
    isSendingResponse
  } = useSubmissionActions({
    onSuccess: () => {
      fetchSubmissions();
      toast({
        title: "Success",
        description: "Action completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error || "An error occurred",
        variant: "destructive",
      });
    }
  });

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // If the submission is not marked as read, mark it as read
    if (!submission.is_read) {
      markAsRead(submission.id);
    }
  };

  const handleCloseDetail = () => {
    setSelectedSubmission(null);
  };

  const handleSendResponse = async (submissionId: string, message: string) => {
    await sendResponse(submissionId, message);
    fetchSubmissions();
  };

  // Show error message if there's an error
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>Error loading submissions: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <SubmissionsList
          submissions={submissions as Submission[]}
          loading={loading}
          onSelect={handleSelectSubmission}
          selectedId={selectedSubmission?.id}
        />
      </div>
      
      <div>
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            onClose={handleCloseDetail}
            onSendResponse={handleSendResponse}
            isSending={isSendingResponse}
          />
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              <p>Select a submission to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
