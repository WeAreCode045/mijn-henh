
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
        // First get replies
        const { data, error } = await supabase
          .from('property_submission_replies')
          .select('*')
          .eq('submission_id', submissionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Process replies and fetch user info separately to avoid relation issues
        const formattedReplies = await Promise.all(data.map(async (reply) => {
          let userInfo = null;
          
          if (reply.user_id) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('id, full_name, email, avatar_url')
              .eq('id', reply.user_id)
              .single();
              
            if (!userError && userData) {
              userInfo = userData;
            }
          }
          
          return {
            id: reply.id,
            submission_id: reply.submission_id,
            agent_id: reply.user_id,
            message: reply.reply_text,
            created_at: reply.created_at,
            agent: userInfo ? {
              id: userInfo.id,
              full_name: userInfo.full_name,
              email: userInfo.email,
              avatar_url: userInfo.avatar_url
            } : undefined
          };
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
