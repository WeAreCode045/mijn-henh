
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Reply {
  id: string;
  submission_id: string;
  reply_text: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  user_avatar: string | null;
}

export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  updated_at: string | null;
  is_read: boolean;
  agent_id: string | null;
  replies: Reply[];
  propertyId?: string;
  inquiryType?: string;
  createdAt?: string;
  isRead?: boolean;
  property?: any;
}

interface UseSubmissionsProps {
  propertyId: string;
}

export function useSubmissions({ propertyId }: UseSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:property_id(*),
          replies:property_submission_replies(
            *,
            user:user_id(*)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data to handle potential errors in the user relation
      const processedData = data.map((submission) => {
        // Handle case where replies might be an error or null
        const replies = Array.isArray(submission.replies) 
          ? submission.replies.map((reply) => {
              // If user data fetch failed, provide fallback values
              return {
                ...reply,
                user_name: reply.user && typeof reply.user !== 'string' ? reply.user.full_name : 'Unknown User',
                user_email: reply.user && typeof reply.user !== 'string' ? reply.user.email : null,
                user_phone: reply.user && typeof reply.user !== 'string' ? reply.user.phone : null,
                user_avatar: reply.user && typeof reply.user !== 'string' ? reply.user.avatar_url : null
              };
            })
          : [];

        return {
          ...submission,
          replies,
          // Add properties needed for compatibility
          propertyId: submission.property_id,
          inquiryType: submission.inquiry_type,
          createdAt: submission.created_at,
          isRead: submission.is_read
        };
      });

      setSubmissions(processedData);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchSubmissions();
    }
  }, [propertyId]);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions
  };
}
