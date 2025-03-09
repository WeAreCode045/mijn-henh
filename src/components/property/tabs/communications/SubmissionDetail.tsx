
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronLeftIcon, MailIcon, UserIcon } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionReplyForm } from './SubmissionReplyForm';
import { Submission, SubmissionDetailProps } from './types';

export function SubmissionDetail({ 
  submission, 
  onCloseDetail, 
  onMarkAsRead,
  onSendResponse,
  isSending
}: SubmissionDetailProps) {
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onCloseDetail} 
          className="p-0 h-auto"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        
        {!submission.is_read && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMarkAsRead(submission.id)}
            className="flex items-center"
          >
            <CheckIcon className="h-3 w-3 mr-2" />
            Mark as Read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{submission.name}</h3>
              <Badge className="ml-3" variant={
                submission.inquiry_type === 'viewing' ? "default" : 
                submission.inquiry_type === 'question' ? "secondary" : "outline"
              }>
                {submission.inquiry_type.charAt(0).toUpperCase() + submission.inquiry_type.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(submission.created_at)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                {submission.email}
              </a>
            </div>
            
            {submission.phone && (
              <div className="flex items-center">
                <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                  {submission.phone}
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">Message:</h4>
            <p className="whitespace-pre-line">{submission.message}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Show replies if they exist */}
      {submission.replies && submission.replies.length > 0 && (
        <SubmissionReplies
          submissionId={submission.id}
          replies={submission.replies}
        />
      )}
      
      {/* Reply form */}
      <SubmissionReplyForm
        onSubmit={onSendResponse}
        isSending={isSending}
      />
    </div>
  );
}
