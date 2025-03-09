
import { SubmissionItem } from './SubmissionItem';
import { Submission, SubmissionsListProps } from './types';

export function SubmissionsList({ 
  submissions, 
  isLoading, 
  selectedSubmission, 
  onSubmissionClick,
  onMarkAsRead
}: SubmissionsListProps) {
  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-center text-gray-500">No messages found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="divide-y">
        {submissions.map((submission) => (
          <SubmissionItem
            key={submission.id}
            submission={submission}
            isSelected={selectedSubmission?.id === submission.id}
            onClick={() => onSubmissionClick(submission)}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}
