
import React, { useState } from 'react';
import { Submission } from '../communications/types';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { useSubmissions } from '../communications/hooks/useSubmissions';
import { useMarkAsRead } from '../communications/hooks/useMarkAsRead';
import { useSendResponse } from '../communications/hooks/useSendResponse';

export function CommunicationsTabContent({ propertyId }: { propertyId: string }) {
  const { submissions, isLoading, error, fetchSubmissions } = useSubmissions(propertyId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const { markAsRead, isMarking } = useMarkAsRead({
    submissionId: selectedSubmission?.id || '',
    isRead: selectedSubmission?.is_read || false,
    onSuccess: fetchSubmissions
  });

  const { sendResponse, isSending } = useSendResponse({
    submissionId: selectedSubmission?.id || '',
    onSuccess: fetchSubmissions
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSendReply = async (text: string) => {
    await sendResponse(text);
  };

  const handleMarkAsRead = async () => {
    await markAsRead();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SubmissionsList 
        submissions={submissions}
        selectedSubmission={selectedSubmission}
        onSelect={setSelectedSubmission}
      />
      
      {selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          onMarkAsRead={handleMarkAsRead}
          isMarking={isMarking}
          onSendReply={handleSendReply}
          isSending={isSending}
        />
      )}
    </div>
  );
}
