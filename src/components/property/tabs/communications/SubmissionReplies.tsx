
import React from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Submission, SubmissionReply } from './types';

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
}

export function SubmissionReplies({ replies }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-semibold">Replies</h3>
      {replies.map((reply) => (
        <Card key={reply.id} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.png" alt="Agent" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Agent Response</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">{reply.text}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
