
import { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { useSubmissions, Submission } from "../communications/useSubmissions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissionActions } from "../communications/hooks/useSubmissionActions";
import { Card } from "@/components/ui/card";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { submissions, isLoading, fetchSubmissions } = useSubmissions(property.id);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const { 
    handleSendResponse,
    markAsRead,
    isSending
  } = useSubmissionActions(fetchSubmissions);

  // When submissions change, update the selected submission
  useEffect(() => {
    if (selectedSubmission && submissions.length > 0) {
      const updated = submissions.find(s => s.id === selectedSubmission.id);
      if (updated) {
        setSelectedSubmission(updated);
      }
    } else if (!selectedSubmission && submissions.length > 0) {
      setSelectedSubmission(submissions[0]);
    }
  }, [submissions, selectedSubmission]);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    if (!submission.is_read) {
      markAsRead(submission.id);
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4">
        <SubmissionsList 
          submissions={submissions} 
          isLoading={isLoading} 
          selectedSubmission={selectedSubmission} 
          onSubmissionSelect={handleSubmissionClick}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
      <div className="md:col-span-8">
        {selectedSubmission ? (
          <SubmissionDetail 
            submission={selectedSubmission} 
            onSendResponse={handleSendResponse}
            isSending={isSending}
          />
        ) : (
          <Card className="p-6">
            <p className="text-center text-gray-500">
              {isLoading ? "Loading..." : (
                submissions.length === 0 
                  ? "No messages for this property yet." 
                  : "Select a message to view details."
              )}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
