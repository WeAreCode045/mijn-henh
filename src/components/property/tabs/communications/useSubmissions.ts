import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Submission {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
  property_id: string;
  inquiry_type: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  submission_id: string;
  user_id: string;
  reply_text: string;
  created_at: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_avatar: string;
}

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          replies:property_submission_replies(
            *,
            user:profiles(id, full_name, email, phone, avatar_url)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include proper user info for each reply
      const transformedData = data?.map(submission => {
        const transformedReplies = (submission.replies || []).map(reply => {
          return {
            ...reply,
            user_name: reply.user?.full_name || 'Unknown',
            user_email: reply.user?.email || '',
            user_phone: reply.user?.phone || '',
            user_avatar: reply.user?.avatar_url || ''
          };
        });

        return {
          ...submission,
          replies: transformedReplies
        };
      });

      setSubmissions(transformedData || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchSubmissions();
    }
  }, [propertyId]);

  return { submissions, loading, error, fetchSubmissions };
}
