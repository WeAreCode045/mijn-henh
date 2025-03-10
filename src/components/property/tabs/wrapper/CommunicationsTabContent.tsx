
import React from "react";
import { PropertyData } from "@/types/property";
import { useSubmissions } from "../communications/useSubmissions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissionSelection } from "../communications/hooks/useSubmissionSelection";
import { useMarkAsRead } from "../communications/hooks/useMarkAsRead";
import { useSendResponse } from "../communications/hooks/useSendResponse";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { submissions, isLoading, fetchSubmissions } = useSubmissions(property.id);
  const { selectedSubmission, setSelectedSubmission } = useSubmissionSelection();
  
  const { markAsRead, isMarking } = useMarkAsRead({
    submissionId: selectedSubmission?.id || '',
    isRead: selectedSubmission?.is_read || false,
    onSuccess: fetchSubmissions
  });

  const { sendResponse, isSending } = useSendResponse({
    submissionId: selectedSubmission?.id || '',
    onSuccess: fetchSubmissions
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <SubmissionsList 
          submissions={submissions}
          isLoading={isLoading}
          selectedSubmissionId={selectedSubmission?.id}
          onSelectSubmission={setSelectedSubmission}
        />
      </div>
      
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            onMarkAsRead={markAsRead}
            isMarking={isMarking}
            onSendReply={sendResponse}
            isSending={isSending}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground">Select a submission to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
