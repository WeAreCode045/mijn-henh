import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Submission, SubmissionReply } from "./useSubmissions";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionResponse } from "./SubmissionResponse";

interface SubmissionDetailProps {
  submission: Submission | undefined;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
  propertyId: string;
}

interface SubmissionResponseProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  responseText: string;
  setResponseText: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;
}

export function SubmissionDetail({ 
  submission, 
  onSendResponse,
  isSending,
  propertyId
}: SubmissionDetailProps) {
  const [responseText, setResponseText] = useState("");
  
  if (!submission) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">No submission selected</p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    await onSendResponse(responseText);
    setResponseText(""); // Clear after sending
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{submission.name}</h3>
                <p className="text-sm text-muted-foreground">{submission.email}</p>
                {submission.phone && (
                  <p className="text-sm text-muted-foreground">{submission.phone}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </span>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    submission.is_read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {submission.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Inquiry Type</h4>
            <p className="bg-muted p-2 rounded">{submission.inquiry_type || 'General inquiry'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Message</h4>
            <div className="bg-muted p-4 rounded whitespace-pre-wrap">
              {submission.message}
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-3">Conversation History</h4>
            
            {submission.replies && submission.replies.length > 0 ? (
              <SubmissionReplies 
                replies={submission.replies}
                submissionId={submission.id}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No replies yet. Be the first to respond.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmissionResponse
            onSubmit={handleSubmit}
            responseText={responseText}
            setResponseText={setResponseText}
            isSending={isSending}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
