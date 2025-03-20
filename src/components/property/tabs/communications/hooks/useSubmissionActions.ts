
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePropertyEditLogger } from '@/hooks/usePropertyEditLogger';

export interface UseMarkAsReadProps {
  submissionId: string;
  isRead: boolean;
  propertyId: string;
  onSuccess?: () => void;
}

export const useMarkAsRead = ({ submissionId, isRead, propertyId, onSuccess }: UseMarkAsReadProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const markAsRead = async () => {
    if (!submissionId) return;
    
    setIsUpdating(true);
    try {
      // Get submission info for better logging
      const { data: submissionData } = await supabase
        .from('property_contact_submissions')
        .select('inquiry_type, name')
        .eq('id', submissionId)
        .single();
        
      const inquiryType = submissionData?.inquiry_type || 'Unknown';
      const submitterName = submissionData?.name || 'Unknown';
      
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !isRead })
        .eq('id', submissionId);
        
      if (error) throw error;
      
      // Log the status change
      if (propertyId) {
        await logPropertyChange(
          propertyId,
          "submission_status",
          isRead ? "Read" : "Unread",
          !isRead ? `Marked as read: ${inquiryType} from ${submitterName}` : 
                   `Marked as unread: ${inquiryType} from ${submitterName}`
        );
      }
      
      toast({
        description: `Submission marked as ${!isRead ? 'read' : 'unread'}`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to update submission status'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { markAsRead, isUpdating };
};

export interface UseSendResponseProps {
  submissionId: string;
  propertyId: string;
  onSuccess?: () => void;
}

export const useSendResponse = ({ submissionId, propertyId, onSuccess }: UseSendResponseProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const sendResponse = async (text: string) => {
    if (!submissionId || !text.trim()) return;
    
    setIsSending(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: text,
          user_id: userData.user?.id
        });
        
      if (error) throw error;
      
      // Log the response
      if (propertyId && userData.user?.id) {
        // Get user name for better logging
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userData.user.id)
          .single();
          
        const userName = profileData?.full_name || userData.user.email || 'Unknown user';
        
        await logPropertyChange(
          propertyId,
          "submission_reply",
          "",
          `Response sent by ${userName}`
        );
      }
      
      toast({
        description: 'Response sent successfully'
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to send response'
      });
    } finally {
      setIsSending(false);
    }
  };

  return { sendResponse, isSending };
};
