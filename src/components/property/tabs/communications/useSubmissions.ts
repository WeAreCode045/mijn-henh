
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission } from './types';

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

          return {
            ...submission,
            replies: repliesData || []
          };
        })
      );

      setSubmissions(submissionsWithReplies as Submission[]);
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
