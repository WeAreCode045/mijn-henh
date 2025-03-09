
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionResponse } from './SubmissionResponse';

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

interface SubmissionDetailProps {
  submission: Submission | null;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionDetail({ submission, onSendResponse, isSending }: SubmissionDetailProps) {
  if (!submission) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a submission to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Submission from {submission.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(submission.createdAt), 'PPP')} at {format(new Date(submission.createdAt), 'p')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Inquiry Type</Label>
              <p className="text-sm">{submission.inquiryType}</p>
            </div>
            
            <div>
              <Label>Property</Label>
              <p className="text-sm">{submission.property.title}</p>
            </div>
            
            <div>
              <Label>Contact Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span> {submission.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span> {submission.email}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span> {submission.phone}
                </div>
              </div>
            </div>
            
            <div>
              <Label>Message</Label>
              <div className="border rounded-md p-3 text-sm mt-1 bg-slate-50">
                {submission.message}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionReplies 
            replies={submission.replies}
            submissionId={submission.id}
          />
          
          <div className="mt-6">
            <SubmissionResponse 
              onSendResponse={onSendResponse} 
              isSending={isSending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
