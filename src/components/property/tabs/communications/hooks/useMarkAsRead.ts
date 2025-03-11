
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface UseMarkAsReadProps {
  propertyId?: string;
  submissionId?: string; 
  isRead?: boolean;
  onSuccess?: () => void;
}

export function useMarkAsRead({ propertyId, submissionId, isRead = false, onSuccess }: UseMarkAsReadProps) {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const markAsRead = async () => {
    if (!submissionId) return;

    setIsMarking(true);
    
    try {
      // Update the is_read flag to true
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !isRead })
        .eq('id', submissionId);
      
      if (error) throw error;
      
      toast({
        description: `Marked submission as ${!isRead ? 'read' : 'unread'}`
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
}
