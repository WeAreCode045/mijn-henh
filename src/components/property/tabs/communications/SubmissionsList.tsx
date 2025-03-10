import React from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Clock, Check, User } from 'lucide-react';
import { Submission } from './types';

interface SubmissionsListProps {
  submissions: Submission[];
  selectedSubmissionId: string;
  onSelectSubmission: (submission: Submission) => void;
  isLoading?: boolean;
}

export const SubmissionsList = ({ 
  submissions, 
  selectedSubmissionId, 
  onSelectSubmission,
  isLoading = false
}: SubmissionsListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-md p-8 bg-muted/10">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">No contact submissions</h3>
        <p className="text-center text-muted-foreground">
          When potential clients submit inquiries about this property, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Contact Submissions</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => onSelectSubmission(submission)}
              className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                selectedSubmissionId === submission.id ? 'bg-muted' : ''
              } ${!submission.is_read ? 'border-l-4 border-l-blue-500 pl-3' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{submission.name}</span>
                </div>
                <Badge variant={
                  submission.inquiry_type === 'viewing' ? 'default' : 
                  submission.inquiry_type === 'question' ? 'secondary' : 'outline'
                }>
                  {submission.inquiry_type.charAt(0).toUpperCase() + submission.inquiry_type.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {submission.message}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(submission.created_at)}
                </div>
                {submission.is_read && (
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Read
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
