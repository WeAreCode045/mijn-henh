
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";
import { useSubmissions } from "../communications/useSubmissions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { Submission } from "../communications/types";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
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

  // Set the first submission as selected when submissions load, if none is selected
  useEffect(() => {
    if (submissions.length > 0 && !selectedSubmission) {
      setSelectedSubmission(submissions[0]);
    }
  }, [submissions, selectedSubmission, setSelectedSubmission]);

  // Handle submission click
  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // If the submission is unread, mark it as read
    if (!submission.is_read) {
      handleMarkAsRead(submission.id);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      {isLoading ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Loading contact submissions...</p>
          </CardContent>
        </Card>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <MessageCircleIcon className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No contact submissions yet</h3>
              <p className="text-muted-foreground">
                When potential clients submit inquiries about this property, they'll appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <SubmissionsList
              submissions={submissions}
              isLoading={isLoading}
              selectedSubmission={selectedSubmission}
              onSubmissionClick={handleSubmissionClick}
            />
          </div>
          
          <div className="md:col-span-2">
            {selectedSubmission && (
              <SubmissionDetail
                submission={selectedSubmission}
                onMarkAsRead={handleMarkAsRead}
                onSendResponse={handleSendResponse}
                isSending={isSending}
                property={property}
                replies={selectedSubmission.replies || []}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
