
import React from 'react';
import { Submission } from './types';
import { SubmissionItem } from './SubmissionItem';

export interface SubmissionsListProps {
  submissions: Submission[];
  onSelectSubmission?: (submission: Submission) => void;
  selectedSubmission?: Submission | null;
}

export function SubmissionsList({ 
  submissions, 
  onSelectSubmission, 
  selectedSubmission 
}: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map(submission => (
        <SubmissionItem 
          key={submission.id} 
          submission={submission} 
          onSelect={onSelectSubmission ? () => onSelectSubmission(submission) : undefined}
          isSelected={selectedSubmission?.id === submission.id}
        />
      ))}
    </div>
  );
}
