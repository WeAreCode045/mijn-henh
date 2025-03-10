import React, { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Submission, Reply } from "./useSubmissions";
import { SubmissionReplies } from "./SubmissionReplies";
import { SubmissionResponse } from "./SubmissionResponse";

interface SubmissionDetailProps {
  submission: Submission;
  onMarkAsRead: (id: string) => void;
  onReply: (id: string, text: string) => Promise<void>;
  isSending: boolean;
}

interface SubmissionResponseProps {
  responseText: string; 
  setResponseText: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  onSubmit: (e: FormEvent<Element>) => Promise<void>;
}

export function SubmissionDetail({ 
  submission, 
  onMarkAsRead,
  onReply,
  isSending
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
    
    await onReply(submission.id, responseText);
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
                  {format(new Date(submission.created_at), "yyyy-MM-dd HH:mm:ss")}
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
          <CardDescription>
            <div className="flex justify-between items-center">
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
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            responseText={responseText}
            setResponseText={setResponseText}
            isSending={isSending}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
