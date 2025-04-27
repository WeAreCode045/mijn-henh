
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function useSendMessage(propertyId: string, participantId: string | null) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ recipientId, message }: { recipientId: string, message: string }) => {
      if (!currentUserId || !propertyId || !recipientId || !message) {
        throw new Error("Missing required fields to send message");
      }

      const { data, error } = await supabase
        .from('property_messages')
        .insert({
          property_id: propertyId,
          sender_id: currentUserId,
          recipient_id: recipientId,
          message,
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["propertyMessages", propertyId, participantId] });
      queryClient.invalidateQueries({ queryKey: ["propertyConversations", propertyId] });
    }
  });

  return { sendMessage };
}
