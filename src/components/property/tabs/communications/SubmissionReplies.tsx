
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionReply } from "../communications/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SubmissionRepliesProps {
  submissionId: string;
}

export function SubmissionReplies({ submissionId }: SubmissionRepliesProps) {
  const [replies, setReplies] = useState<SubmissionReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_submission_replies')
          .select(`
            id, 
            reply_text, 
            created_at, 
            agent_id,
            agent:agent_id(id, full_name, email, agent_photo)
          `)
          .eq('submission_id', submissionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Transform the data to match the SubmissionReply type
        const formattedReplies: SubmissionReply[] = data.map(reply => ({
          id: reply.id,
          reply_text: reply.reply_text,
          created_at: reply.created_at,
          agent_id: reply.agent_id,
          agent: {
            full_name: reply.agent?.full_name || 'Unknown Agent',
            email: reply.agent?.email || '',
            agent_photo: reply.agent?.agent_photo || ''
          }
        }));

        setReplies(formattedReplies);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (submissionId) {
      fetchReplies();
    }
  }, [submissionId]);

  if (isLoading) {
    return <div className="py-4 text-center text-muted-foreground">Loading replies...</div>;
  }

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">Replies</h3>
      {replies.map((reply) => (
        <div key={reply.id} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8">
              {reply.agent.agent_photo && (
                <AvatarImage src={reply.agent.agent_photo} alt={reply.agent.full_name} />
              )}
              <AvatarFallback>
                {reply.agent.full_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{reply.agent.full_name}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(reply.created_at), 'PPP p')}
              </div>
            </div>
          </div>
          <div className="whitespace-pre-line">{reply.reply_text}</div>
        </div>
      ))}
    </div>
  );
}
