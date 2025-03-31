
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Submission, SubmissionDetailProps } from '@/types/submission';
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionReplyForm } from './SubmissionReplyForm';

export function SubmissionDetail({ 
  submission,
  onSendReply,
  isSending,
  onMarkAsRead,
  isMarking,
  onBack
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
        {onBack && (
          <Button 
            onClick={onBack} 
            variant="ghost" 
            size="sm"
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <h3 className="text-lg font-semibold flex-grow">{submission.name}</h3>
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
          recipientEmail={submission.email} // Pass the sender's email as recipient
        />
      </div>
    </div>
  );
}
