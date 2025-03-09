
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply, SubmissionAgent } from './types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:properties(*),
          replies:property_submission_replies(
            *,
            agent:profiles(*)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the Submission type
      const transformedData: Submission[] = (data || []).map(item => {
        // Transform replies to include agent info
        const transformedReplies: SubmissionReply[] = (item.replies || []).map(reply => {
          // Create a safe agent object that handles possible null values
          const agentData: SubmissionAgent = {
            id: reply.agent?.id || '',
            full_name: reply.agent?.full_name || '',
            email: reply.agent?.email || '',
            agent_photo: reply.agent?.agent_photo || ''
          };

          return {
            id: reply.id,
            submission_id: reply.submission_id,
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

      setSubmissions(transformedData);
      
      // If we have a selected submission, update it with fresh data
      if (selectedSubmission) {
        const updatedSelection = transformedData.find(s => s.id === selectedSubmission.id);
        if (updatedSelection) {
          setSelectedSubmission(updatedSelection);
        }
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !submission.is_read })
        .eq('id', submissionId);

      if (error) throw error;

      // Refresh submissions data
      await fetchSubmissions();
    } catch (error) {
      console.error('Error marking submission as read:', error);
    }
  };

  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    setIsSending(true);
    try {
      // Get the user's profile ID (agent ID)
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Insert the reply
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: selectedSubmission.id,
          reply_text: responseText,
          agent_id: userId
        });

      if (error) throw error;

      // Refresh submissions data
      await fetchSubmissions();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (propertyId) {
      fetchSubmissions();
    }
  }, [propertyId]);

  return {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    isSending,
    handleMarkAsRead,
    handleSendResponse,
    refreshSubmissions: fetchSubmissions
  };
}
