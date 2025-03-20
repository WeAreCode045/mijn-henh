
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function useMarkAsRead(submissionId: string, propertyId: string, onSuccess?: () => void) {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const markAsRead = async () => {
    setIsMarking(true);
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
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) throw error;
      
      // Log the marked as read action
      if (propertyId) {
        await logPropertyChange(
          propertyId,
          "submission_status",
          "Unread",
          `Marked as read: ${inquiryType} from ${submitterName}`
        );
      }

      toast({
        title: "Success",
        description: "Marked as read successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  // Renamed to handleMarkAsRead for consistency
  const handleMarkAsRead = markAsRead;

  return {
    markAsRead,
    handleMarkAsRead,
    isMarking
  };
}
