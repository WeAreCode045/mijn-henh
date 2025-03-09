
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SubmissionReply {
  id: string;
  reply_text: string;
  created_at: string;
  agent_id: string;
  agent?: {
    full_name: string;
    email: string;
    agent_photo: string;
  };
}

interface SubmissionRepliesProps {
  submissionId: string;
}

export function SubmissionReplies({ submissionId }: SubmissionRepliesProps) {
  const [replies, setReplies] = useState<SubmissionReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
          agent:profiles(full_name, email, agent_photo)
        `)
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setReplies(data || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (submissionId) {
      fetchReplies();
    }
  }, [submissionId]);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Replies</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (replies.length === 0) {
    return null; // Don't show anything if there are no replies
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">Replies</h3>
      {replies.map((reply) => (
        <Card key={reply.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={reply.agent?.agent_photo || ''} />
                <AvatarFallback>{reply.agent?.full_name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{reply.agent?.full_name || "Agent"}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(reply.created_at), "PPP 'at' p")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="whitespace-pre-wrap">{reply.reply_text}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
