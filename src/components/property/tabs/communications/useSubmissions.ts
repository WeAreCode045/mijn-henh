
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from './types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First fetch the submissions for this property
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('property_contact_submissions')
        .select(`
          id, 
          name, 
          email, 
          phone, 
          message, 
          inquiry_type, 
          property_id, 
          agent_id,
          created_at, 
          is_read,
          property:properties(id, title)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // If no submissions found, return empty array
      if (!submissionsData || submissionsData.length === 0) {
        setSubmissions([]);
        setIsLoading(false);
        return;
      }

      // For each submission, fetch its replies
      const submissionsWithReplies = await Promise.all(
        submissionsData.map(async (submission) => {
          const { data: repliesData, error: repliesError } = await supabase
            .from('property_submission_replies')
            .select(`
              id,
              submission_id,
              message,
              created_at,
              agent:profiles(id, full_name, email, agent_photo)
            `)
            .eq('submission_id', submission.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            return {
              ...submission,
              replies: []
            };
          }

          // Map replies to correct type
          const typedReplies: SubmissionReply[] = repliesData?.map(reply => ({
            id: reply.id,
            submission_id: reply.submission_id,
            message: reply.message,
            created_at: reply.created_at,
            agent: reply.agent ? {
              id: reply.agent.id,
              full_name: reply.agent.full_name,
              email: reply.agent.email,
              agent_photo: reply.agent.agent_photo
            } : null
          })) || [];

          return {
            id: submission.id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            message: submission.message,
            inquiry_type: submission.inquiry_type,
            property_id: submission.property_id,
            agent_id: submission.agent_id,
            created_at: submission.created_at,
            is_read: submission.is_read,
            property: submission.property ? {
              id: submission.property.id,
              title: submission.property.title
            } : undefined,
            replies: typedReplies
          };
        })
      );

      setSubmissions(submissionsWithReplies);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchSubmissions();
    }
  }, [propertyId]);

  return { submissions, isLoading, error, fetchSubmissions };
}
