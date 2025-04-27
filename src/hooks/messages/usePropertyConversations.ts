
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Conversation } from "@/types/message";

export function usePropertyConversations(propertyId: string) {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    error: conversationsError
  } = useQuery({
    queryKey: ["propertyConversations", propertyId],
    queryFn: async (): Promise<Conversation[]> => {
      if (!currentUserId || !propertyId) return [];

      try {
        // First, get all messages for this property where the current user is either sender or recipient
        const { data: messagesData, error: messagesError } = await supabase
          .from('property_messages')
          .select(`
            id,
            property_id,
            sender_id,
            recipient_id,
            message,
            created_at,
            is_read,
            properties:property_id(title)
          `)
          .eq('property_id', propertyId)
          .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (messagesError) {
          console.error("Error fetching messages for conversations:", messagesError);
          return [];
        }

        if (!messagesData || messagesData.length === 0) {
          return [];
        }

        // Extract unique participants (excluding the current user)
        const participantsMap = new Map<string, Conversation>();

        for (const message of messagesData) {
          // Determine the participant (not the current user)
          const participantId = message.sender_id === currentUserId
            ? message.recipient_id
            : message.sender_id;
          
          // Skip if we already have this participant with a more recent message
          if (participantsMap.has(participantId)) {
            continue;
          }

          // Get participant details from profiles
          const { data: participantData, error: participantError } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .eq('id', participantId)
            .single();

          if (participantError) {
            console.error(`Error fetching participant ${participantId}:`, participantError);
            continue;
          }

          // Count unread messages from this participant
          const { count: unreadCount, error: countError } = await supabase
            .from('property_messages')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', propertyId)
            .eq('sender_id', participantId)
            .eq('recipient_id', currentUserId)
            .eq('is_read', false);

          if (countError) {
            console.error("Error counting unread messages:", countError);
          }

          // Add to participants map
          participantsMap.set(participantId, {
            participantId: participantId,
            participantName: participantData.full_name || 'Unknown User',
            participantEmail: participantData.email || '',
            participantAvatar: participantData.avatar_url,
            lastMessage: message.message,
            lastMessageDate: message.created_at,
            unreadCount: unreadCount || 0,
            propertyId: propertyId,
            propertyTitle: message.properties?.title || 'Unknown Property'
          });
        }

        // Convert map to array
        return Array.from(participantsMap.values());
      } catch (err) {
        console.error("Error in conversations query:", err);
        return [];
      }
    },
    enabled: !!currentUserId && !!propertyId
  });

  return {
    conversations,
    isLoadingConversations,
    conversationsError
  };
}
