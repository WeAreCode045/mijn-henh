
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";

interface SubmissionRepliesProps {
  submissionId: string;
  replies: Array<{
    id: string;
    reply_text: string;
    created_at: string;
    agent?: {
      full_name?: string;
      email?: string;
      agent_photo?: string;
    } | null;
  }>;
}

export function SubmissionReplies({ replies, submissionId }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center p-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p>No replies yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Replies</h3>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-slate-50 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reply.agent?.agent_photo || ""} />
                  <AvatarFallback>{(reply.agent?.full_name || "Agent").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{reply.agent?.full_name || "Agent"}</span>
                  <span className="text-xs text-muted-foreground">{reply.agent?.email || ""}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="text-sm whitespace-pre-line">
                {reply.reply_text}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
