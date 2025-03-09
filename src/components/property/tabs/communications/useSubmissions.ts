
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Submission, SubmissionReply } from './types';

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:property_id (id, title),
          replies:property_submission_replies (
            id, 
            reply_text, 
            created_at,
            agent:agent_id (
              id, 
              full_name, 
              email, 
              agent_photo
            )
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our expected shape
      const transformedData = data.map(item => {
        const transformedReplies = item.replies?.map(reply => ({
          ...reply,
          submission_id: item.id, // Add the submission_id field
          agent: reply.agent || undefined,
        })) || [];
        
        return {
          ...item,
          replies: transformedReplies,
        };
      });
      
      setSubmissions(transformedData as Submission[]);
      
      // If we have a selected submission, update it with the fresh data
      if (selectedSubmission) {
        const updatedSubmission = transformedData.find(s => s.id === selectedSubmission.id);
        if (updatedSubmission) {
          setSelectedSubmission(updatedSubmission as Submission);
        }
      }
      
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, selectedSubmission, toast]);

  // Fetch submissions on component mount and when propertyId changes
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Mark a submission as read
  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
        
      if (error) throw error;
      
      // Update local state
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
          sub.id === submissionId ? { ...sub, is_read: true } : sub
        )
      );
      
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission({ ...selectedSubmission, is_read: true });
      }
      
      toast({
        title: 'Success',
        description: 'Submission marked as read',
      });
      
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark submission as read',
        variant: 'destructive',
      });
    }
  };

  // Send a response to a submission
  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    setIsSending(true);
    try {
      // Call Supabase Edge Function to send the email
      const { error } = await supabase.functions.invoke('send-submission-reply', {
        body: {
          submissionId: selectedSubmission.id,
          responseText,
          recipientEmail: selectedSubmission.email,
          recipientName: selectedSubmission.name,
          propertyTitle: selectedSubmission.property?.title || 'Property',
        },
      });
      
      if (error) throw error;
      
      await fetchSubmissions(); // Refresh the submissions
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent successfully',
      });
      
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: 'Error',
        description: 'Failed to send response',
        variant: 'destructive',
      });
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
    refreshSubmissions: fetchSubmissions,
  };
}
