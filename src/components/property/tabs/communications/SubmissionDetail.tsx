
import React from "react";
import { Submission, SubmissionReply } from "./types";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionReplyForm } from "./SubmissionReplyForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, Check, X, User, MessageSquare } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface SubmissionDetailProps {
  submission: Submission;
  onMarkAsRead: (submissionId: string) => Promise<void>;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionDetail({
  submission,
  onMarkAsRead,
  onSendResponse,
  isSending
}: SubmissionDetailProps) {
  if (!submission) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a submission to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-muted-foreground" />
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
                onClick={() => onMarkAsRead(submission.id)}
              >
                {submission.is_read ? (
                  <X className="h-4 w-4 mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {submission.is_read ? 'Mark Unread' : 'Mark Read'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                {submission.email}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                {submission.phone}
              </a>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(submission.created_at)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 bg-muted p-4 rounded-md">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" /> 
              <h4 className="font-semibold">Message:</h4>
            </div>
            <p className="whitespace-pre-line">{submission.message}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionReplies 
            submissionId={submission.id} 
            replies={submission.replies || []}
          />
          
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Send Response</h4>
            <SubmissionReplyForm 
              onSendResponse={onSendResponse}
              isSending={isSending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
