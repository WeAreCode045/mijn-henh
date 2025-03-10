import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, Calendar, Eye, EyeOff } from 'lucide-react';
import { Submission, SubmissionDetailProps } from './types';
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionResponse } from './SubmissionResponse';
import { formatDate } from '@/utils/dateUtils';

export function SubmissionDetail({ 
  submission, 
  onMarkAsRead, 
  isMarking,
  onSendReply,
  isSending 
}: SubmissionDetailProps) {
  const [responseText, setResponseText] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (responseText.trim()) {
      await onSendReply(responseText);
      setResponseText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => {}} 
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>
        
        <Button
          variant="outline"
          onClick={onMarkAsRead}
          disabled={isMarking}
          className="flex items-center gap-1"
        >
          {submission.is_read ? (
            <>
              <EyeOff className="h-4 w-4" />
              Mark as unread
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Mark as read
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{submission.name}</h3>
            <div className="flex flex-col space-y-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{submission.email}</span>
              </div>
              {submission.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{submission.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(submission.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Message</h4>
            <p className="whitespace-pre-line">{submission.message}</p>
          </div>
        </CardContent>
      </Card>
      
      <SubmissionReplies
        replies={submission.replies}
        submissionId={submission.id}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Reply to inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionResponse 
            value={responseText}
            onChange={setResponseText}
            isSending={isSending}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
