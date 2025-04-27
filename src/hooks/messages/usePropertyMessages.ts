
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyMessage, MessageData } from "@/types/message.d";
import { User } from "@/types/user";
import { usePropertyConversations } from "./usePropertyConversations";
import { useSendMessage } from "./useSendMessage";

export function usePropertyMessages(propertyId: string, participantId: string | null) {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const currentUserId = user?.id;

  const {
    conversations,
    isLoadingConversations,
    conversationsError
  } = usePropertyConversations(propertyId);

  const { sendMessage } = useSendMessage(propertyId, participantId);

  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useQuery({
    queryKey: ["propertyMessages", propertyId, participantId],
    queryFn: async () => {
      if (!currentUserId || !propertyId || !participantId) return [];

      try {
        const { data, error } = await supabase
          .from('property_messages')
          .select(`
            id,
            property_id,
            sender_id,
            recipient_id,
            message,
            created_at,
            is_read,
            updated_at,
            sender:profiles!sender_id(id, full_name, phone, email, avatar_url, whatsapp_number, created_at, updated_at),
            recipient:profiles!recipient_id(id, full_name, email, avatar_url, phone, whatsapp_number, created_at, updated_at)
          `)
          .eq('property_id', propertyId)
          .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${participantId}),and(sender_id.eq.${participantId},recipient_id.eq.${currentUserId})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return [];
        }

        // Mark messages as read
        const unreadMessages = data.filter(
          msg => !msg.is_read && msg.recipient_id === currentUserId
        );
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map(msg => msg.id);
          await supabase
            .from('property_messages')
            .update({ is_read: true })
            .in('id', unreadIds);

          queryClient.invalidateQueries({ queryKey: ["propertyConversations", propertyId] });
        }

        // Process messages to ensure they have all required fields
        const processedMessages = data.map(msg => ({
          ...msg,
          updated_at: msg.updated_at || msg.created_at // Default to created_at if updated_at is not available
        }));

        return processedMessages as PropertyMessage[];
      } catch (err) {
        console.error("Error in messages query:", err);
        return [];
      }
    },
    enabled: !!currentUserId && !!propertyId && !!participantId
  });

  // Create a currentUser object from the profile data, ensuring all required fields are included
  // and explicitly handle optional properties with proper typing
  return {
    conversations,
    isLoadingConversations,
    conversationsError,
    messages,
    isLoadingMessages,
    messagesError,
    sendMessage,
    currentUser: profile ? {
      id: profile.id,
      email: profile.email || '',
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url,
      role: profile.role as User["role"],
      phone: profile.phone || undefined,
      whatsapp_number: profile.whatsapp_number || undefined,
      created_at: profile.created_at || undefined,
      updated_at: profile.updated_at || undefined
    } : null
  };
}
