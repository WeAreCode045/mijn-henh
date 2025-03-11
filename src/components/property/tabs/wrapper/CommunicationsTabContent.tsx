
import React, { useState } from 'react';
import { useFetchSubmissions } from '../communications/hooks/useFetchSubmissions';
import { useMarkAsRead } from '../communications/hooks/useMarkAsRead';
import { useSendResponse } from '../communications/hooks/useSendResponse';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { Submission } from '../communications/types';
import { useAuth } from '@/providers/AuthProvider';

interface CommunicationsTabContentProps {
  propertyId: string;
}

export function CommunicationsTabContent({ propertyId }: CommunicationsTabContentProps) {
  const { submissions, isLoading, refetch } = useFetchSubmissions(propertyId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { profile } = useAuth();
  
  const { markAsRead, isMarking } = useMarkAsRead({
    submissionId: selectedSubmission?.id || '',
    onSuccess: refetch
  });
  
  const { sendResponse, isSending } = useSendResponse({
    submissionId: selectedSubmission?.id || '',
    agentId: profile?.id || '',
    onSuccess: refetch
  });
  
  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };
  
  const handleDeselectSubmission = () => {
    setSelectedSubmission(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className={`w-full ${selectedSubmission ? 'hidden md:block md:w-1/3' : 'w-full'}`}>
        <SubmissionsList 
          submissions={submissions}
          isLoading={isLoading}
          onSelect={handleSelectSubmission}
          selectedId={selectedSubmission?.id}
        />
      </div>
      
      {selectedSubmission && (
        <div className="w-full md:w-2/3">
          <SubmissionDetail
            submission={selectedSubmission}
            onMarkAsRead={markAsRead}
            isMarking={isMarking}
            onSendReply={sendResponse}
            isSending={isSending}
          />
        </div>
      )}
    </div>
  );
}
