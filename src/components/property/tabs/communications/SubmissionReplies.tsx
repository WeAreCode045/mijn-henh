
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/utils/dateUtils';
import { SubmissionReply } from './types';

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
  submissionId: string;
}

export function SubmissionReplies({ replies, submissionId }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No responses yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {replies.map((reply) => (
          <div key={reply.id} className="border-b last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                {reply.user_avatar || (reply.agent?.avatar_url) ? (
                  <AvatarImage src={reply.user_avatar || reply.agent?.avatar_url || ''} alt={(reply.user_name || reply.agent?.full_name || 'User')} />
                ) : (
                  <AvatarFallback>
                    {((reply.user_name || reply.agent?.full_name || 'U')).charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{reply.user_name || reply.agent?.full_name || 'Staff Member'}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line">{reply.reply_text || reply.message}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
