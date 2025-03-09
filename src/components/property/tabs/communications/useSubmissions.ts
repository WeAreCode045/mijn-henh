
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

// Define the Submission type for better type safety
export interface Submission {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
  agent_id?: string;
  inquiry_type?: string;
  replies?: Array<{
    id: string;
    submission_id: string;
    reply_text: string;
    created_at: string;
    agent?: {
      id: string;
      full_name?: string;
      email?: string;
      agent_photo?: string;
    } | null;
  }>;
  property?: {
    title: string;
    address: string;
  } | null;
}

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch submissions for the property
  const fetchSubmissions = useCallback(async () => {
    if (!propertyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select(`
          *,
          property:properties(title, address),
          replies:property_submission_replies(
            id,
            reply_text,
            created_at,
            agent:profiles(id, full_name, email, agent_photo)
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);

      // If we had a selected submission, refresh it
      if (selectedSubmission) {
        const updated = data?.find(sub => sub.id === selectedSubmission.id);
        if (updated) {
          setSelectedSubmission(updated);
        }
      }

    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, selectedSubmission, toast]);

  // Mark a submission as read
  const handleMarkAsRead = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) throw error;

      // Update local state to reflect the change
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId ? { ...sub, is_read: true } : sub
        )
      );

      // Update selected submission if needed
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, is_read: true } : null);
      }

    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  // Send a response to a submission
  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !user?.id) return;

    setIsSending(true);
    try {
      // First save the reply to the database
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: selectedSubmission.id,
          reply_text: responseText,
          agent_id: user.id
        });

      if (error) throw error;

      // Then call the Edge Function to process the email sending
      const { error: functionError } = await supabase.functions.invoke('send-submission-reply', {
        body: {
          submissionId: selectedSubmission.id,
          replyText: responseText,
          agentId: user.id
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Success",
        description: "Response sent successfully",
      });

      // Refresh the submissions to see the new reply
      await fetchSubmissions();

    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Refresh function for external use
  const refreshSubmissions = useCallback(() => {
    return fetchSubmissions();
  }, [fetchSubmissions]);

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
