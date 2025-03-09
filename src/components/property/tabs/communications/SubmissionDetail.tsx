
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, Send } from "lucide-react";
import { Submission } from "./types";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionReplyForm } from "./SubmissionReplyForm";

export interface SubmissionDetailProps {
  submission: Submission;
  onMarkAsRead?: (submissionId: string) => Promise<void>;
  onSendResponse: (responseText: string) => Promise<void>;
}

export function SubmissionDetail({ submission, onMarkAsRead, onSendResponse }: SubmissionDetailProps) {
  const handleMarkAsRead = async () => {
    if (onMarkAsRead && !submission.is_read) {
      await onMarkAsRead(submission.id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{submission.name}</CardTitle>
            <div className="flex flex-col text-sm text-muted-foreground mt-1">
              <span>{submission.email}</span>
              <span>{submission.phone}</span>
              <span className="text-xs mt-1">
                {format(new Date(submission.created_at), "PPP 'at' p")}
              </span>
            </div>
          </div>
          {!submission.is_read && onMarkAsRead && (
            <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
              <MailCheck className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="rounded-md bg-muted p-4 whitespace-pre-line">
          {submission.message}
        </div>
        
        <SubmissionReplies submissionId={submission.id} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4 pb-6">
        <SubmissionReplyForm onSendResponse={onSendResponse} />
      </CardFooter>
    </Card>
  );
}
