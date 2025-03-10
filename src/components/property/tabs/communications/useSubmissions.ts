
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from './types';

export const useSubmissions = (propertyId: string) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubmissions = useCallback(async () => {
    if (!propertyId) {
      setError('Property ID is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          replies:property_submission_replies(
            *,
            user:profiles(
              full_name, 
              email, 
              phone, 
              avatar_url
            )
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      if (data) {
        // Transform data to match the expected format
        const transformedData = data.map(submission => {
          // Transform replies
          const transformedReplies = submission.replies?.map(reply => {
            // Handle potential missing user data
            const userFullName = reply.user?.full_name || 'Unknown User';
            const userEmail = reply.user?.email || '';
            const userPhone = reply.user?.phone || '';
            const userAvatar = reply.user?.avatar_url || '';

            return {
              ...reply,
              user_name: userFullName,
              user_email: userEmail,
              user_phone: userPhone,
              user_avatar: userAvatar
            } as SubmissionReply;
          }) || [];

          // Create a submission object with all fields needed
          return {
            ...submission,
            replies: transformedReplies,
            propertyId: submission.property_id,
            inquiryType: submission.inquiry_type || 'contact',
            createdAt: submission.created_at,
            isRead: submission.is_read
          } as Submission;
        });

        setSubmissions(transformedData);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  return { submissions, loading, error, fetchSubmissions };
};
