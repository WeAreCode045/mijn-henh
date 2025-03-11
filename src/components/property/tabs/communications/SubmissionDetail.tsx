
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { Submission } from './types';
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionReplyForm } from './SubmissionReplyForm';

interface SubmissionDetailProps {
  submission: Submission;
  onSendReply: (text: string) => Promise<void>;
  isSending: boolean;
  onMarkAsRead: () => Promise<void>;
  isMarking: boolean;
}

export function SubmissionDetail({ 
  submission,
  onSendReply,
  isSending,
  onMarkAsRead,
  isMarking
}: SubmissionDetailProps) {
  const [replyText, setReplyText] = useState('');

  const handleMarkAsReadClick = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  const handleReplySubmit = () => {
    if (onSendReply && replyText.trim()) {
      onSendReply(replyText.trim())
        .then(() => setReplyText(''));
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
      
      {submission.replies && submission.replies.length > 0 && (
        <div className="mt-4">
          <SubmissionReplies replies={submission.replies} />
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Reply</h4>
        <SubmissionReplyForm
          value={replyText}
          onChange={setReplyText}
          onSubmit={handleReplySubmit}
          isSubmitting={isSending}
        />
      </div>
    </div>
  );
}
