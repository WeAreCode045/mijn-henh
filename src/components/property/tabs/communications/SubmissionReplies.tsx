import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export interface SubmissionReply {
  id: string;
  created_at: string;
  reply_text: string;
  agent?: {
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
  submissionId: string;
}

export function SubmissionReplies({ replies, submissionId }: SubmissionRepliesProps) {
  // Sort replies by created_at
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  return (
    <div className="space-y-4">
      {sortedReplies.map((reply) => (
        <div key={reply.id} className="flex gap-3">
          <div className="flex-shrink-0">
            {reply.agent ? (
              <Avatar>
                <AvatarImage 
                  src={reply.agent.avatar_url || ''} 
                  alt={reply.agent.full_name || 'Agent'} 
                />
                <AvatarFallback>
                  {reply.agent.full_name 
                    ? reply.agent.full_name.charAt(0).toUpperCase() 
                    : 'A'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">
                    {reply.agent?.full_name || 'System'}
                  </span>
                  {reply.agent?.email && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({reply.agent.email})
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="whitespace-pre-wrap">
                {reply.reply_text}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
