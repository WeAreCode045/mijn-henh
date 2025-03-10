
import React from 'react';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { useSubmissions } from '../communications/useSubmissions';
import { Submission } from '../communications/types';

export function CommunicationsTabContent({ propertyId }: { propertyId: string }) {
  const { submissions, isLoading, error, refetch } = useSubmissions(propertyId);
  const { markAsRead: handleMarkAsRead, isMarking } = useMarkAsRead();
  const { sendResponse: handleSendResponse, isSending } = useSendResponse();
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);

  const formattedSubmissions = submissions.map(sub => ({
    id: sub.id,
    property_id: sub.property_id,
    name: sub.name,
    email: sub.email,
    phone: sub.phone,
    message: sub.message,
    inquiry_type: sub.inquiry_type,
    is_read: sub.is_read,
    created_at: sub.created_at,
    updated_at: sub.updated_at,
    agent_id: sub.agent_id,
    agent: {
      id: sub.agent?.id,
      full_name: sub.agent?.full_name,
      email: sub.agent?.email,
      phone: sub.agent?.phone,
      avatar_url: sub.agent?.avatar_url
    },
    replies: sub.replies
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SubmissionsList 
        submissions={formattedSubmissions}
        selectedSubmission={selectedSubmission}
        onSelect={setSelectedSubmission}
      />
      
      {selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          onMarkAsRead={handleMarkAsRead}
          isMarking={isMarking}
          onSendReply={handleSendResponse}
          isSending={isSending}
        />
      )}
    </div>
  );
}
