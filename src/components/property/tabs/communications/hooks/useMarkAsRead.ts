
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMarkAsRead(submissionId: string, onSuccess?: () => void) {
  const [isMarking, setIsMarking] = useState(false);

  const markAsRead = async () => {
    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      if (error) throw error;
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error marking submission as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  const handleMarkAsRead = markAsRead; // Alias for consistent API

  return {
    markAsRead,
    handleMarkAsRead,
    isMarking
  };
}
