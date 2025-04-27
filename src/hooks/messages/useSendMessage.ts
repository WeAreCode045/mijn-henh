
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { MessageData } from "@/types/message.d";

export function useSendMessage(propertyId: string, recipientId: string | null) {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messageData: MessageData) => {
    if (!currentUserId || !propertyId || !messageData.recipientId) {
      throw new Error("Missing required information to send message");
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('property_messages')
        .insert({
          property_id: propertyId,
          sender_id: currentUserId,
          recipient_id: messageData.recipientId,
          message: messageData.message,
          is_read: false
        })
        .select();

      if (error) {
        throw error;
      }

      // Invalidate the messages query to refresh the messages list
      queryClient.invalidateQueries({ 
        queryKey: ["propertyMessages", propertyId, messageData.recipientId]
      });
      
      // Invalidate the conversations query to update the conversations list
      queryClient.invalidateQueries({ 
        queryKey: ["propertyConversations", propertyId]
      });

      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
}
