
import React from 'react';
import { format } from 'date-fns';

interface Agent {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  agent: Agent | null;
}

interface SubmissionRepliesProps {
  replies: SubmissionReply[];
  submissionId: string;
}

export function SubmissionReplies({ replies, submissionId }: SubmissionRepliesProps) {
  if (!replies || replies.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No replies yet
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {replies.map((reply) => (
        <div key={reply.id} className="border rounded-lg p-4 bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            {reply.agent?.photoUrl ? (
              <img 
                src={reply.agent.photoUrl} 
                alt={reply.agent.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {reply.agent?.name?.[0] || 'A'}
              </div>
            )}
            <div>
              <p className="font-medium">{reply.agent?.name || 'Agent'}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(reply.createdAt), 'MMM d, yyyy - h:mm a')}
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm prose max-w-none">
            <p>{reply.replyText}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
