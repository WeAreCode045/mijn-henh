
import React, { useState, useEffect } from 'react';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { useSubmissions } from '../communications/useSubmissions';
import { useSubmissionActions } from '../communications/hooks/useSubmissionActions';
import { useMarkAsRead } from '../communications/hooks/useMarkAsRead';
import { useSendResponse } from '../communications/hooks/useSendResponse';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  property: {
    id: string;
    title: string;
  };
  replies: {
    id: string;
    submissionId: string;
    replyText: string;
    createdAt: string;
    agent: {
      id: string;
      name: string;
      email: string;
      photoUrl?: string;
    } | null;
  }[];
}

interface CommunicationsTabContentProps {
  propertyId: string;
}

export function CommunicationsTabContent({ propertyId }: CommunicationsTabContentProps) {
  const { submissions, isLoading, selectedSubmission, setSelectedSubmission } = useSubmissions(propertyId);
  
  const { handleMarkAsRead } = useMarkAsRead();
  const { handleSendResponse, isSending } = useSendResponse();
  
  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // Mark as read if not already read
    if (!submission.isRead) {
      handleMarkAsRead(submission.id);
    }
  };
  
  const handleResponseSend = async (responseText: string) => {
    if (!selectedSubmission) return;
    
    await handleSendResponse(responseText, selectedSubmission.id);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <SubmissionsList
          submissions={submissions}
          isLoading={isLoading}
          selectedSubmission={selectedSubmission}
          onSubmissionClick={handleSubmissionClick}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
      <div className="md:col-span-2">
        <SubmissionDetail
          submission={selectedSubmission}
          onSendResponse={handleResponseSend}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
