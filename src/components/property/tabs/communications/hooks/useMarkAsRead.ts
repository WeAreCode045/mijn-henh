
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useMarkAsRead(submissionId: string, onSuccess?: () => void) {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const markAsRead = async () => {
    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('property_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) throw error;

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
