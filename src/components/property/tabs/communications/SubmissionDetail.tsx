
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { useMarkAsRead } from './hooks';
import { useSendResponse } from './hooks';
import { Submission } from './types';

interface SubmissionDetailProps {
  submission: Submission;
  onSendReply: (text: string) => Promise<void>;
  isSending: boolean;
  onMarkAsRead: () => void;
  isMarking: boolean;
}

export function SubmissionDetail({ submission, onSendReply, isSending, onMarkAsRead, isMarking }: SubmissionDetailProps) {
  const handleMarkAsReadClick = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  const handleReplySubmit = (text: string) => {
    if (onSendReply) {
      onSendReply(text);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{submission.name}</h3>
        {!submission.is_read && (
          <Button 
            onClick={handleMarkAsReadClick} 
            variant="outline" 
            size="sm"
            disabled={isMarking}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Read
          </Button>
        )}
      </div>
      <div className="mt-2">
        <p><strong>Email:</strong> {submission.email}</p>
        <p><strong>Phone:</strong> {submission.phone}</p>
        <p><strong>Message:</strong> {submission.message}</p>
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Reply</h4>
        <textarea 
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Type your reply here..."
        />
        <Button 
          onClick={() => handleReplySubmit('Sample reply text')} 
          className="mt-2"
          disabled={isSending}
        >
          Send Reply
        </Button>
      </div>
    </div>
  );
}
