
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from '../types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = async () => {
    if (!propertyId) {
      setSubmissions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          agent:profiles(id, full_name, email, phone, avatar_url)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // For each submission, fetch replies
      const submissionsWithReplies = await Promise.all(
        submissionsData.map(async (submission) => {
          const { data: repliesData } = await supabase
            .from('property_submission_replies')
            .select('*')
            .eq('submission_id', submission.id)
            .order('created_at', { ascending: true });

          // Map database reply fields to our SubmissionReply type
          const replies: SubmissionReply[] = (repliesData || []).map(reply => ({
            id: reply.id,
            text: reply.reply_text,
            created_at: reply.created_at,
            agent_id: reply.agent_id
          }));

          // Map database submission fields to our Submission type
          return {
            id: submission.id,
            property_id: submission.property_id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            message: submission.message,
            inquiry_type: submission.inquiry_type,
            is_read: submission.is_read,
            created_at: submission.created_at,
            updated_at: submission.updated_at,
            agent_id: submission.agent_id,
            agent: submission.agent ? {
              id: submission.agent.id,
              full_name: submission.agent.full_name,
              email: submission.agent.email,
              phone: submission.agent.phone,
              avatar_url: submission.agent.avatar_url
            } : undefined,
            replies
          } as Submission;
        })
      );

      setSubmissions(submissionsWithReplies);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching submissions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  return { submissions, isLoading, error, fetchSubmissions };
}
