
import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SubmissionReply } from '@/types/submission';

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
}

export function SubmissionReplies({ replies }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Previous Replies</h4>
      <div className="space-y-4">
        {replies.map((reply) => {
          const replyDate = new Date(reply.created_at);
          // Handle both agent and user properties for the reply creator
          const replyCreator = reply.agent || reply.user;
          const creatorName = replyCreator 
            ? (reply.agent?.full_name || reply.user?.name || 'Agent') 
            : 'Agent';
          const creatorAvatar = replyCreator 
            ? (reply.agent?.avatar_url || reply.user?.avatar_url) 
            : undefined;
          
          // Handle both message and text properties
          const replyContent = reply.message || reply.text || '';
          
          return (
            <div key={reply.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  {creatorAvatar && <AvatarImage src={creatorAvatar} alt={creatorName} />}
                  <AvatarFallback>
                    {creatorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{creatorName}</div>
                  <div className="text-xs text-gray-500">
                    {format(replyDate, 'PPP p')}
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="whitespace-pre-wrap">{replyContent}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
