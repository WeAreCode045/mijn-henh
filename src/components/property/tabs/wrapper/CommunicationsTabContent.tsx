
import { useState } from 'react';
import { useSubmissions } from '../communications/useSubmissions';
import { useSubmissionActions } from '../communications/hooks/useSubmissionActions';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { useMarkAsRead } from '../communications/hooks/useMarkAsRead';
import { useSendResponse } from '../communications/hooks/useSendResponse';
import { Submission } from '../communications/types';

interface CommunicationsTabContentProps {
  property: {
    id: string;
    title: string;
  };
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const { submissions, isLoading, fetchSubmissions } = useSubmissions(property.id);
  const { handleMarkAsRead } = useMarkAsRead({
    propertyId: property.id,
    refetchSubmissions: fetchSubmissions
  });
  const { handleSendResponse, isSending } = useSendResponse({
    propertyId: property.id, 
    refetchSubmissions: fetchSubmissions
  });

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // If the submission is not read, mark it as read
    if (!submission.is_read) {
      handleMarkAsRead(submission.id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <SubmissionsList 
          submissions={submissions}
          isLoading={isLoading}
          selectedSubmission={selectedSubmission}
          onSubmissionClick={handleSubmissionClick}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
      <div className="lg:col-span-2">
        <SubmissionDetail 
          submission={selectedSubmission} 
          onSendResponse={handleSendResponse}
          isSending={isSending}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </div>
  );
}
