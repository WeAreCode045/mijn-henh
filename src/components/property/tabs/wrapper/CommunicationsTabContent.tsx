
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useFetchSubmissions } from "../communications/hooks/useFetchSubmissions";
import { useMarkAsRead } from "../communications/hooks/useMarkAsRead";
import { useSendResponse } from "../communications/hooks/useSendResponse";
import { Submission } from "../communications/types";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { submissions, isLoading, error, refetch } = useFetchSubmissions(property.id);
  const { handleMarkAsRead, isMarking } = useMarkAsRead({
    onSuccess: () => refetch()
  });
  const { handleSendResponse, isSending } = useSendResponse({
    onSuccess: () => refetch()
  });

  useEffect(() => {
    // If we have submissions and none is selected, select the first one
    if (submissions && submissions.length > 0 && !selectedSubmission) {
      setSelectedSubmission(submissions[0]);
    }
    
    // If the selected submission is no longer in the list, reset selection
    if (selectedSubmission && submissions) {
      const stillExists = submissions.some(s => s.id === selectedSubmission.id);
      if (!stillExists) {
        setSelectedSubmission(submissions.length > 0 ? submissions[0] : null);
      }
    }
  }, [submissions, selectedSubmission]);

  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    // If the submission is unread, mark it as read
    if (submission && !submission.isRead) {
      handleMarkAsRead(submission.id);
    }
  };

  const handleSendReply = async (text: string) => {
    if (!selectedSubmission) return;
    
    await handleSendResponse({
      submissionId: selectedSubmission.id,
      text
    });
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading submissions: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  // Normalize submissions to match the expected type
  const normalizedSubmissions: Submission[] = submissions.map((sub: any) => ({
    id: sub.id,
    propertyId: sub.property_id,
    name: sub.name,
    email: sub.email,
    phone: sub.phone,
    message: sub.message,
    inquiryType: sub.inquiry_type || "General",
    isRead: sub.is_read,
    createdAt: sub.created_at,
    updatedAt: sub.updated_at,
    agentId: sub.agent_id,
    agent: sub.agent ? {
      id: sub.agent.id,
      fullName: sub.agent.full_name,
      email: sub.agent.email,
      phone: sub.agent.phone,
      avatarUrl: sub.agent.avatar_url
    } : null,
    replies: sub.replies || []
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <SubmissionsList
          submissions={normalizedSubmissions}
          selectedSubmission={selectedSubmission}
          onSelect={handleSubmissionSelect}
        />
      </div>
      
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            onSendReply={handleSendReply}
            isSending={isSending}
            onMarkAsRead={() => selectedSubmission && handleMarkAsRead(selectedSubmission.id)}
            isMarking={isMarking}
          />
        ) : (
          <div className="h-64 flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Select an inquiry to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
