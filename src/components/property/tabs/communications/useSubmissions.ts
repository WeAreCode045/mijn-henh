
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from './types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch submissions for this property
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          agent:profiles(id, full_name, email, phone, avatar_url)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (submissionsError) throw submissionsError;
      
      // Fetch replies for each submission
      const submissionsWithReplies = await Promise.all(
        (submissionsData || []).map(async (submission) => {
          const { data: repliesData, error: repliesError } = await supabase
            .from('property_submission_replies')
            .select(`
              *,
              user:profiles(id, full_name, email, phone, avatar_url)
            `)
            .eq('submission_id', submission.id)
            .order('created_at', { ascending: true });
          
          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            return { ...submission, replies: [] };
          }
          
          // Transform the replies data to match our expected format
          const transformedReplies = (repliesData || []).map((reply): SubmissionReply => {
            // Safely handle the user field which might be a SelectQueryError
            const user = reply.user || {};
            return {
              ...reply,
              user_id: reply.agent_id, // Use agent_id as user_id since that's what we have
              user_name: user.full_name || 'Unknown',
              user_email: user.email || '',
              user_phone: user.phone || '',
              user_avatar: user.avatar_url || ''
            } as SubmissionReply;
          });
          
          return { 
            ...submission,
            // Add compatibility fields
            propertyId: submission.property_id,
            inquiryType: submission.inquiry_type,
            createdAt: submission.created_at,
            isRead: submission.is_read,
            replies: transformedReplies 
          };
        })
      );
      
      setSubmissions(submissionsWithReplies);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);
  
  return { submissions, loading, error, fetchSubmissions };
}
