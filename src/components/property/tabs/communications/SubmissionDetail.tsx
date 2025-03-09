
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmissionReplyForm } from "./SubmissionReplyForm";
import { SubmissionReplies } from "./SubmissionReplies";
import { Submission } from "./types";

interface SubmissionDetailProps {
  submission: Submission;
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionDetail({ 
  submission, 
  onSendResponse,
  isSending
}: SubmissionDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              Inquiry from {submission.name}
              {!submission.is_read && (
                <Badge className="ml-2 bg-blue-500">New</Badge>
              )}
            </CardTitle>
            <Badge variant="outline">
              {submission.inquiry_type || 'General Inquiry'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(submission.created_at)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div>{submission.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Phone</div>
                <div>{submission.phone}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1">Message</div>
              <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                {submission.message}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {submission.replies && submission.replies.length > 0 && (
        <SubmissionReplies
          submissionId={submission.id}
          replies={submission.replies}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionReplyForm
            onSend={onSendResponse}
            isSubmitting={isSending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
