
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissions } from "../communications/useSubmissions";
import { Submission } from "../communications/types";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');
  
  const {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    isSending,
    handleMarkAsRead,
    handleSendResponse,
    refreshSubmissions
  } = useSubmissions(property.id);
  
  // Handler for when a submission is clicked in the list
  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setSelectedSubmissionId(submission.id);
    
    // Mark as read if it's unread
    if (!submission.is_read) {
      handleMarkAsRead(submission.id);
    }
  };
  
  // Handler for closing the detail view
  const handleCloseDetail = () => {
    setSelectedSubmissionId('');
    setSelectedSubmission(null);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No contact submissions found for this property.</p>
          </CardContent>
        </Card>
      ) : selectedSubmissionId && selectedSubmission ? (
        <SubmissionDetail
          submission={selectedSubmission}
          onCloseDetail={handleCloseDetail}
          onMarkAsRead={handleMarkAsRead}
          onSendResponse={handleSendResponse}
          isSending={isSending}
        />
      ) : (
        <SubmissionsList
          submissions={submissions}
          isLoading={isLoading}
          selectedSubmissionId={selectedSubmissionId}
          onSubmissionClick={handleSubmissionClick}
        />
      )}
    </div>
  );
}
