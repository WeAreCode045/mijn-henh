
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { SubmissionReply } from '@/types/submission';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
}

export function SubmissionReplies({ replies }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Previous Replies</h3>
      
      <div className="space-y-3">
        {replies.map((reply) => {
          const initials = reply.agent?.full_name 
            ? reply.agent.full_name.split(' ').map(name => name[0]).join('')
            : reply.user?.name
              ? reply.user.name.split(' ').map(name => name[0]).join('')
              : 'U';
          
          const displayName = reply.agent?.full_name || reply.user?.name || "User";
          const message = reply.message || reply.text || "";
          const avatarUrl = reply.agent?.avatar_url || reply.user?.avatar_url;
          
          return (
            <div key={reply.id} className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="mt-1 text-sm whitespace-pre-line">
                    {message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
