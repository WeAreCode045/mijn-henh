
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmissionReply } from "./types";

interface SubmissionRepliesProps {
  submissionId: string;
  replies: SubmissionReply[];
}

export function SubmissionReplies({ submissionId, replies }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) return null;
  
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
  
  const getInitials = (name?: string) => {
    if (!name) return "AA";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-4">
              <Avatar>
                {reply.agent?.agent_photo ? (
                  <AvatarImage src={reply.agent.agent_photo} alt={reply.agent?.full_name || 'Agent'} />
                ) : (
                  <AvatarFallback>{getInitials(reply.agent?.full_name)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{reply.agent?.full_name || 'Agent'}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(reply.created_at)}
                  </div>
                </div>
                <div className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {reply.reply_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
