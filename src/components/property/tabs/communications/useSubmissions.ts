
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from './types';

export function useSubmissions(propertyId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:property_id(*),
          replies:property_submission_replies(
            *,
            agent:agent_id(*)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our types
      const transformedSubmissions: Submission[] = data.map(item => {
        // Transform replies to match our SubmissionReply type
        const transformedReplies: SubmissionReply[] = (item.replies || []).map(reply => {
          let agentData = null;
          if (reply.agent && typeof reply.agent === 'object') {
            agentData = {
              id: reply.agent.id || '',
              full_name: reply.agent.full_name || '',
              email: reply.agent.email || '',
              agent_photo: reply.agent.agent_photo || ''
            };
          }
          
          return {
            id: reply.id,
            submission_id: reply.submission_id || item.id,
            reply_text: reply.reply_text,
            created_at: reply.created_at,
            agent: agentData
          };
        });
        
        return {
          id: item.id,
          property_id: item.property_id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          inquiry_type: item.inquiry_type,
          is_read: item.is_read,
          created_at: item.created_at,
          updated_at: item.updated_at,
          agent_id: item.agent_id,
          property: item.property,
          replies: transformedReplies
        };
      });
      
      setSubmissions(transformedSubmissions as Submission[]);
      
      if (transformedSubmissions.length > 0 && !selectedSubmission) {
        setSelectedSubmission(transformedSubmissions[0]);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const refreshSubmissions = () => {
    fetchSubmissions();
  };

  return {
    submissions,
    selectedSubmission,
    isLoading,
    handleSubmissionClick,
    refreshSubmissions
  };
}
