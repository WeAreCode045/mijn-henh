
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionItem } from './SubmissionItem';

interface Agent {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface Property {
  id: string;
  title: string;
}

interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  agent: Agent | null;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  property: Property;
  replies: SubmissionReply[];
}

interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedSubmission: Submission | null;
  onSubmissionClick: (submission: Submission) => void;
  onMarkAsRead: (submissionId: string) => void;
}

export function SubmissionsList({ 
  submissions, 
  isLoading, 
  selectedSubmission, 
  onSubmissionClick,
  onMarkAsRead
}: SubmissionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary mx-auto rounded-full border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map(submission => (
              <SubmissionItem
                key={submission.id}
                submission={submission}
                isSelected={selectedSubmission?.id === submission.id}
                onClick={() => onSubmissionClick(submission)}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
