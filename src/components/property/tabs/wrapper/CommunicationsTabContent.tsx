
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
  
  const { markAsRead, isMarking } = useMarkAsRead(
    selectedSubmission?.id || '',
    refetch
  );
  
  const { sendResponse, isSending } = useSendResponse(
    selectedSubmission?.id || '',
    profile?.id || '',
    refetch
  );
  
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
          onSelectSubmission={handleSelectSubmission}
          selectedSubmissionId={selectedSubmission?.id}
        />
      </div>
      
      {selectedSubmission && (
        <div className="w-full md:w-2/3">
          <SubmissionDetail
            submission={selectedSubmission}
            onBack={handleDeselectSubmission}
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
