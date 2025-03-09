
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissions } from "../communications/useSubmissions";
import { useSendResponse } from "../communications/hooks/useSendResponse";
import { useMarkAsRead } from "../communications/hooks/useMarkAsRead";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  // Use the submissions hook
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

  // Get the selected submission ID
  const selectedSubmissionId = selectedSubmission?.id || "";

  // Handle submission selection
  const handleSubmissionClick = (submission: any) => {
    setSelectedSubmission(submission);
    
    // Mark as read if not already read
    if (!submission.is_read) {
      handleMarkAsRead(submission.id);
    }
  };

  // Handle sending a response
  const handleSendReply = async (responseText: string) => {
    if (!selectedSubmission) return;
    
    await handleSendResponse(responseText);
    await refreshSubmissions();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>

      {property.id ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left panel: Submissions list */}
          <div className="md:col-span-1">
            <SubmissionsList 
              submissions={submissions}
              isLoading={isLoading}
              selectedSubmissionId={selectedSubmissionId}
              onSubmissionClick={handleSubmissionClick}
            />
          </div>

          {/* Right panel: Submission details */}
          <div className="md:col-span-2">
            {selectedSubmission ? (
              <SubmissionDetail 
                submission={selectedSubmission}
                onSendReply={handleSendReply}
                isSending={isSending}
                propertyData={property}
                onMarkAsRead={handleMarkAsRead}
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No submission selected</AlertTitle>
                    <AlertDescription>
                      Select a submission from the list to view details.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No property ID</AlertTitle>
              <AlertDescription>
                This property must be saved before you can manage communications.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
