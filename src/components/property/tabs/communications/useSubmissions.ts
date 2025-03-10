import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubmissionReply {
  id: string;
  submission_id: string;
  reply_text: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string; // Changed from photo_url to avatar_url
  } ;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  is_read: boolean;
  property?: {
    id: string;
    title: string;
  } | null;
  replies: SubmissionReply[];
}

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching submissions for property:', propertyId);
      
      // First get the submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('property_contact_submissions')
        .select(`
          id, 
          name, 
          email, 
          phone, 
          message, 
          inquiry_type, 
          created_at, 
          is_read,
          property:property_id (id, title)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (submissionsError) {
        throw submissionsError;
      }
      
      if (!submissionsData || submissionsData.length === 0) {
        console.log('No submissions found for property:', propertyId);
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      console.log('Found submissions:', submissionsData.length);
      
      // For each submission, get its replies
      const submissionsWithReplies = await Promise.all(submissionsData.map(async (submission) => {
        const { data: repliesData, error: repliesError } = await supabase
          .from('property_submission_replies')
          .select(`
            id, 
            submission_id, 
            reply_text, 
            created_at,
            user:user_id (id, full_name, email, avatar_url)
          `)
          .eq('submission_id', submission.id)
          .order('created_at', { ascending: true });
        
        if (repliesError) {
          console.error('Error fetching replies for submission:', submission.id, repliesError);
          return {
            ...submission,
            replies: []
          };
        }
        
        // Map the replies with safe user data
        const mappedReplies = (repliesData || []).map(reply => {
          const safeUser = reply.user && typeof reply.user === 'object' ? {
            id: reply.user?.id || '',
            full_name: reply.user.full_name || '',
            email: reply.user.email || '',
            avatar_url: reply.user.avatar_url || '' // Changed from photo_url to avatar_url
          } : null;
          
          return {
            id: reply.id,
            submission_id: reply.submission_id,
            reply_text: reply.reply_text,
            created_at: reply.created_at,
            user: safeUser
          };
        });
        
        return {
          ...submission,
          replies: mappedReplies
        };
      }));
      
      setSubmissions(submissionsWithReplies);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
