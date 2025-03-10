
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/dateUtils";
import { Reply, Submission } from "./useSubmissions";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionResponse } from "./SubmissionReplyForm";

interface SubmissionDetailProps {
  submission: Submission;
  onClose: () => void;
  onSendResponse: (submissionId: string, message: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionDetail({ 
  submission, 
  onClose, 
  onSendResponse,
  isSending 
}: SubmissionDetailProps) {
  const [responseText, setResponseText] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    await onSendResponse(submission.id, responseText);
    setResponseText("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{submission.name}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
        <CardDescription>
          {submission.email} • {submission.phone} • {formatDate(submission.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Subject</h3>
          <p>{submission.subject || "Property Inquiry"}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Message</h3>
          <p className="whitespace-pre-wrap">{submission.message}</p>
        </div>

        {submission.property && (
          <div>
            <h3 className="font-semibold mb-1">Property</h3>
            <p>{submission.property.title || "Unknown Property"}</p>
            <p className="text-sm text-muted-foreground">{submission.property.address || ""}</p>
          </div>
        )}

        <Separator />

        {submission.replies && submission.replies.length > 0 && (
          <SubmissionReplies 
            replies={submission.replies} 
            submissionId={submission.id}
          />
        )}

        <CardFooter className="px-0 pt-4 flex-col items-start">
          <SubmissionResponse
            responseText={responseText}
            setResponseText={setResponseText}
            isSending={isSending}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      </CardContent>
    </Card>
  );
}
