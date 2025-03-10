
import React from "react";
import { Reply } from "./useSubmissions";
import { formatDate } from "@/utils/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SubmissionRepliesProps {
  replies: Reply[];
  submissionId: string;
}

export function SubmissionReplies({ replies, submissionId }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Previous Responses</h3>
      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={reply.user_avatar} />
              <AvatarFallback>{getInitials(reply.user_name || 'Unknown')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{reply.user_name || 'Agent'}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{reply.reply_text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
