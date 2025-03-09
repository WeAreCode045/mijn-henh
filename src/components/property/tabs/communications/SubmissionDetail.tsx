
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, MailIcon, PhoneIcon, CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionResponse } from './SubmissionResponse';
import { Submission, SubmissionReply } from './types';
import { formatDate } from "@/utils/dateUtils";
import { PropertyData } from "@/types/property";

interface SubmissionDetailProps {
  submission: Submission;
  onMarkAsRead: (submissionId: string) => Promise<void>;
  onSendResponse: (text: string) => Promise<void>;
  isSending: boolean;
  property: PropertyData;
  replies: SubmissionReply[];
}

export function SubmissionDetail({
  submission,
  onMarkAsRead,
  onSendResponse,
  isSending,
  property,
  replies
}: SubmissionDetailProps) {
  if (!submission) return null;

  const handleToggleReadStatus = async () => {
    await onMarkAsRead(submission.id);
  };

  const handleResponseSubmit = async (responseText: string) => {
    await onSendResponse(responseText);
  };

  return (
    <div className="space-y-4">
      <Card className={submission.is_read ? "" : "border-l-4 border-l-blue-500"}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle className="text-lg">{submission.name}</CardTitle>
              <Badge className="ml-3" variant={
                submission.inquiry_type === 'viewing' ? "default" : 
                submission.inquiry_type === 'question' ? "secondary" : "outline"
              }>
                {submission.inquiry_type.charAt(0).toUpperCase() + submission.inquiry_type.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleReadStatus}
              >
                {submission.is_read ? (
                  <XIcon className="h-4 w-4 mr-1" />
                ) : (
                  <CheckIcon className="h-4 w-4 mr-1" />
                )}
                {submission.is_read ? 'Mark Unread' : 'Mark Read'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                {submission.email}
              </a>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                {submission.phone}
              </a>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(submission.created_at)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">Message:</h4>
            <p className="whitespace-pre-line">{submission.message}</p>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${submission.email}?subject=RE: Inquiry about ${property.title}`}>
                <MailIcon className="h-4 w-4 mr-2" />
                Reply by Email
              </a>
            </Button>
            {submission.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${submission.phone}`}>
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display submission replies */}
      <SubmissionReplies
        submissionId={submission.id}
        replies={replies}
      />

      {/* Reply form */}
      <SubmissionResponse
        onSendResponse={handleResponseSubmit}
        isSending={isSending}
      />
    </div>
  );
}
