
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseMarkAsReadOptions {
  submissionId: string;
  isRead: boolean;
  onSuccess: () => Promise<void>;
}

export function useMarkAsRead({ submissionId, isRead, onSuccess }: UseMarkAsReadOptions) {
  const [isMarking, setIsMarking] = useState(false);

  const markAsRead = async () => {
    if (!submissionId) {
      console.error('Missing submission ID');
      return;
    }

    setIsMarking(true);
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: !isRead })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      await onSuccess();
    } catch (error) {
      console.error('Error marking submission as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
}
