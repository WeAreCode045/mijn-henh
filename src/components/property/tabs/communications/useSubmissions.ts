
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionReply } from './types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const refreshSubmissions = useCallback(async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:properties(id, title, address),
          replies:property_submission_replies(
            id, reply_text, created_at, 
            agent:profiles(id, full_name, email, agent_photo)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our expected types
      const transformedData: Submission[] = data.map(submission => {
        // Transform replies to include submission_id
        const transformedReplies: SubmissionReply[] = (submission.replies || []).map(reply => {
          // Handle the case where agent could be a SelectQueryError
          let agentData = null;
          if (reply.agent && typeof reply.agent === 'object' && !('error' in reply.agent)) {
            agentData = {
              id: reply.agent.id,
              full_name: reply.agent.full_name,
              email: reply.agent.email,
              agent_photo: reply.agent.agent_photo
            };
          }
          
          return {
            id: reply.id,
            submission_id: submission.id, // Add the submission_id
            reply_text: reply.reply_text,
            created_at: reply.created_at,
            agent: agentData
          };
        });
        
        return {
          ...submission,
          replies: transformedReplies
        };
      });
      
      setSubmissions(transformedData);
      
      // Update selected submission if it exists
      if (selectedSubmission) {
        const updated = transformedData.find(s => s.id === selectedSubmission.id);
        if (updated) {
          setSelectedSubmission(updated);
        }
      }
      
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, selectedSubmission]);

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === submissionId 
            ? { ...submission, is_read: true } 
            : submission
        )
      );
      
      // Update selected submission if it's the one that was marked as read
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, is_read: true } : null);
      }
      
    } catch (error) {
      console.error('Error marking submission as read:', error);
    }
  };

  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: selectedSubmission.id,
          reply_text: responseText
        })
        .select();
      
      if (error) throw error;
      
      // Refresh to get the updated replies
      await refreshSubmissions();
      
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    isSending,
    handleMarkAsRead,
    handleSendResponse,
    refreshSubmissions
  };
}
