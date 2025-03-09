
import React from "react";
import { useSubmissions } from "../communications/useSubmissions";
import { useSendResponse } from "../communications/hooks/useSendResponse";
import { useMarkAsRead } from "../communications/hooks/useMarkAsRead";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { PropertyData } from "@/types/property";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { 
    submissions, 
    selectedSubmission, 
    isLoading, 
    handleSubmissionClick,
    refreshSubmissions
  } = useSubmissions(property.id);
  
  const { 
    handleSendResponse, 
    isSending 
  } = useSendResponse(selectedSubmission?.id, refreshSubmissions);
  
  const { 
    handleMarkAsRead 
  } = useMarkAsRead(refreshSubmissions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <SubmissionsList 
          submissions={submissions} 
          isLoading={isLoading}
          selectedSubmission={selectedSubmission}
          onSubmissionClick={handleSubmissionClick}
        />
      </div>
      
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <SubmissionDetail 
            submission={selectedSubmission}
            onMarkAsRead={handleMarkAsRead}
            onSendResponse={handleSendResponse}
            isSending={isSending}
          />
        ) : (
          <div className="h-64 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : 'Select an inquiry to view details'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
