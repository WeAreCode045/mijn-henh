
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle } from 'lucide-react';
import { Submission } from './types';

interface SubmissionsListProps {
  submissions: Submission[];
  onSelect: (submission: Submission) => void;
  isLoading: boolean;
  selectedId?: string;
}

export function SubmissionsList({ submissions = [], onSelect, isLoading, selectedId }: SubmissionsListProps) {
  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border rounded-lg">
        No submissions found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedId === submission.id
              ? 'bg-primary/10 border-primary/30'
              : submission.is_read
              ? 'bg-gray-50 hover:bg-gray-100'
              : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
          }`}
          onClick={() => onSelect(submission)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{submission.name}</h4>
              <p className="text-sm text-gray-600">{getInquiryTypeLabel(submission.inquiry_type)}</p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              {submission.is_read ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <Circle className="h-4 w-4 text-blue-500 mr-1" />
              )}
              {format(new Date(submission.created_at), 'dd/MM/yyyy')}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {submission.message?.substring(0, 60) || 'No message provided'}
            {submission.message?.length > 60 ? '...' : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
