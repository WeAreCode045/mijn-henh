
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { SubmissionReply } from '@/types/submission';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2Icon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
  expandedReplyIds?: Set<string>;
  onToggleReply?: (id: string) => void;
  onDeleteReply?: (id: string) => void;
}

export function SubmissionReplies({ 
  replies, 
  expandedReplyIds = new Set(),
  onToggleReply, 
  onDeleteReply 
}: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  const isExpanded = (id: string) => expandedReplyIds.has(id);

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
            <Collapsible 
              key={reply.id} 
              open={isExpanded(reply.id)}
              onOpenChange={() => onToggleReply && onToggleReply(reply.id)}
              className="border rounded-md bg-muted/50"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {onDeleteReply && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 h-8 w-8 hover:bg-red-100 hover:text-red-700"
                      onClick={() => onDeleteReply(reply.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                  {onToggleReply && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 p-0 w-8">
                        {isExpanded(reply.id) ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
              </div>
              <CollapsibleContent className="px-3 pb-3">
                <div className="whitespace-pre-line">{message}</div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
