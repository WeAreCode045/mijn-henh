
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionItem } from './SubmissionItem';
import { Submission } from './types';

interface SubmissionsListProps {
  submissions: Submission[];
  selectedSubmission?: Submission | null;
  onSelect: (submission: Submission) => void;
}

export function SubmissionsList({ 
  submissions, 
  selectedSubmission, 
  onSelect 
}: SubmissionsListProps) {
  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No inquiries received yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSelectSubmission = (submission: Submission) => {
    onSelect(submission);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquiries</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {submissions.map(submission => (
            <SubmissionItem
              key={submission.id}
              submission={submission}
              isSelected={selectedSubmission?.id === submission.id}
              onClick={() => handleSelectSubmission(submission)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
