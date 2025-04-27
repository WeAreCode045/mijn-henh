
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyMessage } from "@/types/message";
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
            sender:profiles!sender_id(id, full_name, email, avatar_url),
            recipient:profiles!recipient_id(id, full_name, email, avatar_url)
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

        return data as PropertyMessage[];
      } catch (err) {
        console.error("Error in messages query:", err);
        return [];
      }
    },
    enabled: !!currentUserId && !!propertyId && !!participantId
  });

  // Create a currentUser object from the profile data
  const currentUser: User | null = profile ? {
    id: profile.id,
    email: profile.email || '',
    full_name: profile.full_name || '',
    avatar_url: profile.avatar_url,
    role: profile.role as "admin" | "agent" | "seller" | "buyer" | undefined,
    phone: profile.phone,
    whatsapp_number: profile.whatsapp_number,
    created_at: profile.created_at,
    updated_at: profile.updated_at
  } : null;

  return {
    conversations,
    isLoadingConversations,
    conversationsError,
    messages,
    isLoadingMessages,
    messagesError,
    sendMessage,
    currentUser
  };
}
