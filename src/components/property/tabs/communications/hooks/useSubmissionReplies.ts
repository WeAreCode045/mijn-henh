
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubmissionReply } from '@/types/submission';

export function useSubmissionReplies(submissionId: string) {
  const [replies, setReplies] = useState<SubmissionReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!submissionId) {
        setReplies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('property_submission_replies')
          .select(`
            id,
            submission_id,
            reply_text,
            created_at,
            user_id,
            user:profiles(id, full_name, email, avatar_url)
          `)
          .eq('submission_id', submissionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedReplies = data.map(reply => ({
          id: reply.id,
          submission_id: reply.submission_id,
          agent_id: reply.user_id,
          message: reply.reply_text,
          created_at: reply.created_at,
          agent: reply.user ? {
            id: reply.user.id,
            full_name: reply.user.full_name,
            email: reply.user.email,
            avatar_url: reply.user.avatar_url
          } : undefined
        }));

        setReplies(formattedReplies);
      } catch (err: any) {
        console.error('Error fetching submission replies:', err);
        setError(err.message || 'Failed to load replies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [submissionId]);

  return {
    replies,
    isLoading,
    error
  };
}
