
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Submission } from '../useSubmissions';

export interface UseMarkAsReadProps {
  propertyId: string;
  onSuccess?: () => void;
}

export interface UseSendResponseProps {
  propertyId: string;
  onSuccess?: () => void;
}

export function useMarkAsRead({ propertyId, onSuccess }: UseMarkAsReadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const markAsRead = async (submissionId: string) => {
    if (!submissionId) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      toast({
        title: "Bericht gemarkeerd als gelezen",
        description: "Het bericht is succesvol gemarkeerd als gelezen.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het markeren van het bericht als gelezen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return { markAsRead, isLoading };
}

export function useSendResponse({ propertyId, onSuccess }: UseSendResponseProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const sendResponse = async (submissionId: string, message: string) => {
    if (!submissionId || !message.trim()) return;
    
    setIsSending(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Insert reply
      const { error } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: message,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Antwoord verzonden",
        description: "Je antwoord is succesvol verzonden.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het versturen van je antwoord.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return { sendResponse, isSending };
}
