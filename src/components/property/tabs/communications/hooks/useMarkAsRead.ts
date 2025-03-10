
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface UseMarkAsReadProps {
  propertyId: string;
}

export function useMarkAsRead({ propertyId }: UseMarkAsReadProps) {
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = async (submissionId: string) => {
    if (!submissionId) return;

    setIsMarking(true);
    
    try {
      // Update the is_read flag to true
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId)
        .eq('property_id', propertyId);
      
      if (error) throw error;
      
      console.log('Marked submission as read:', submissionId);
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

  return { handleMarkAsRead, isMarking };
}
