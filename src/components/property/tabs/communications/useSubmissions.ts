
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubmissionAgent {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
}

interface SubmissionReply {
  id: string;
  reply_text: string;
  created_at: string;
  agent: SubmissionAgent;
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
  replies: SubmissionReply[];
  property: {
    id: string;
    title: string;
  };
}

export const useSubmissions = (propertyId: string) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_submissions')
        .select(`
          *,
          property:property_id(id, title),
          replies:property_submission_replies(
            *,
            agent:agent_id(id, full_name, email, agent_photo)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Submission interface
      const transformedData = data.map(item => {
        // Process replies to handle possible null values in agent
        const transformedReplies = (item.replies || []).map(reply => ({
          id: reply.id,
          reply_text: reply.reply_text,
          created_at: reply.created_at,
          agent: {
            id: reply.agent?.id || 'unknown',
            name: reply.agent?.full_name || 'Unknown Agent',
            email: reply.agent?.email || '',
            photo: reply.agent?.agent_photo || null
          }
        }));

        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message || '',
          inquiry_type: item.inquiry_type,
          created_at: item.created_at,
          is_read: item.is_read,
          replies: transformedReplies,
          property: {
            id: item.property.id,
            title: item.property.title
          }
        } as Submission;
      });

      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  return { submissions, isLoading, fetchSubmissions };
};
