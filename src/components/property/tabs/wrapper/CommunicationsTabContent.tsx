
import React, { useState, useEffect } from 'react';
import { PropertyData } from "@/types/property";
import { useSubmissions } from "../communications/hooks";
import { useMarkAsRead } from "../communications/hooks";
import { useSendResponse } from "../communications/hooks";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { Submission } from "../communications/types";
import { useAuth } from "@/providers/AuthProvider";

export function CommunicationsTabContent({ property }: { property: PropertyData }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { submissions, isLoading, fetchSubmissions, error, refetch } = useSubmissions(property.id);
  const { markAsRead, handleMarkAsRead, isMarking } = useMarkAsRead(
    selectedSubmission?.id || '',
    () => {
      fetchSubmissions();
    }
  );
  const { profile } = useAuth();
  const { sendResponse, handleSendResponse, isSending } = useSendResponse(
    selectedSubmission?.id || '',
    profile?.id || '',
    () => {
      fetchSubmissions();
    }
  );

  useEffect(() => {
    fetchSubmissions();
  }, [property.id]);

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleMarkCurrentAsRead = () => {
    if (selectedSubmission && !selectedSubmission.is_read) {
      handleMarkAsRead();
    }
  };

  const handleSendReply = async (text: string) => {
    if (selectedSubmission) {
      await handleSendResponse(text);
    }
  };

  // Map submissions to the correct format
  const formattedSubmissions: Submission[] = submissions.map((sub: any) => ({
    id: sub.id,
    property_id: sub.propertyId,
    name: sub.name,
    email: sub.email,
    phone: sub.phone,
    message: sub.message,
    inquiry_type: sub.inquiryType,
    is_read: sub.isRead,
    created_at: sub.createdAt,
    updated_at: sub.updatedAt,
    agent_id: sub.agentId,
    agent: {
      id: sub.agent?.id,
      full_name: sub.agent?.fullName,
      email: sub.agent?.email,
      phone: sub.agent?.phone,
      avatar_url: sub.agent?.avatarUrl
    },
    replies: sub.replies
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>
        <SubmissionsList 
          submissions={formattedSubmissions} 
          onSelect={handleSelectSubmission}
          isLoading={isLoading}
          selectedId={selectedSubmission?.id}
        />
      </div>
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submission Details</h2>
            <SubmissionDetail
              submission={selectedSubmission}
              onSendReply={handleSendReply}
              isSending={isSending}
              onMarkAsRead={handleMarkCurrentAsRead}
              isMarking={isMarking}
            />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 border rounded-lg">
            Select a submission to view details
          </div>
        )}
      </div>
    </div>
  );
}
