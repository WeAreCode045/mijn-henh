
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { Conversation } from "@/types/message";

export function usePropertyConversations(propertyId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    error: conversationsError
  } = useQuery({
    queryKey: ["propertyConversations", propertyId],
    queryFn: async () => {
      if (!currentUserId || !propertyId) return [];

      try {
        const { data, error } = await supabase
          .from('property_messages')
          .select(`
            id,
            sender_id,
            recipient_id,
            message,
            created_at,
            is_read,
            sender:profiles!sender_id(id, full_name, email, avatar_url),
            recipient:profiles!recipient_id(id, full_name, email, avatar_url)
          `)
          .eq('property_id', propertyId)
          .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching conversations:", error);
          return [];
        }

        return processConversationsData(data, currentUserId, propertyId);
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

function processConversationsData(data: any[], currentUserId: string, propertyId: string): Conversation[] {
  const conversationMap = new Map<string, Conversation>();
  
  data.forEach((message: any) => {
    const otherParticipantId = message.sender_id === currentUserId ? 
      message.recipient_id : message.sender_id;
      
    const otherParticipant = message.sender_id === currentUserId ? 
      message.recipient : message.sender;
      
    if (!otherParticipant || !otherParticipantId) return;
    
    if (!conversationMap.has(otherParticipantId)) {
      conversationMap.set(otherParticipantId, {
        participantId: otherParticipantId,
        participantName: otherParticipant.full_name || 'Unknown',
        participantEmail: otherParticipant.email || '',
        participantAvatar: otherParticipant.avatar_url,
        lastMessage: message.message,
        lastMessageDate: message.created_at,
        unreadCount: message.is_read ? 0 : (message.sender_id !== currentUserId ? 1 : 0),
        propertyId,
        propertyTitle: ''
      });
    } else {
      const conversation = conversationMap.get(otherParticipantId)!;
      if (!message.is_read && message.sender_id !== currentUserId) {
        conversation.unreadCount += 1;
      }
    }
  });
  
  return Array.from(conversationMap.values());
}
