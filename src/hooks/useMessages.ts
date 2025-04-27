
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyMessage, Conversation } from "@/types/message";
import { User } from "@/types/user";

export function usePropertyMessages(propertyId: string, participantId: string | null) {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const currentUserId = user?.id;

  // Fetch conversations
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    error: conversationsError
  } = useQuery({
    queryKey: ["propertyConversations", propertyId],
    queryFn: async () => {
      if (!currentUserId || !propertyId) return [];

      // This is a placeholder - implement the actual logic to fetch conversations
      // for this property from your database
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          message,
          created_at,
          is_read,
          sender:sender_id(id, full_name, email, avatar_url),
          recipient:recipient_id(id, full_name, email, avatar_url)
        `)
        .eq('property_id', propertyId)
        .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        return [];
      }

      // Process the data to group by participant
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
            unreadCount: message.is_read ? 0 : 1,
            propertyId,
            propertyTitle: '' // You might want to fetch this separately
          });
        } else {
          // Update unread count
          const conversation = conversationMap.get(otherParticipantId)!;
          if (!message.is_read && message.sender_id !== currentUserId) {
            conversation.unreadCount += 1;
          }
        }
      });
      
      return Array.from(conversationMap.values());
    },
    enabled: !!currentUserId && !!propertyId
  });

  // Fetch messages for a specific conversation
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useQuery({
    queryKey: ["propertyMessages", propertyId, participantId],
    queryFn: async () => {
      if (!currentUserId || !propertyId || !participantId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          property_id,
          sender_id,
          recipient_id,
          message,
          created_at,
          is_read,
          sender:sender_id(id, full_name, email, avatar_url),
          recipient:recipient_id(id, full_name, email, avatar_url)
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
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }

      return data as PropertyMessage[];
    },
    enabled: !!currentUserId && !!propertyId && !!participantId
  });

  // Mutation to send a message
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ recipientId, message }: { recipientId: string, message: string }) => {
      if (!currentUserId || !propertyId || !recipientId || !message) {
        throw new Error("Missing required fields to send message");
      }

      const { data, error } = await supabase
        .from('messages')
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

  // Create a currentUser object from the profile data
  const currentUser: User | null = profile ? {
    id: profile.id,
    email: profile.email || '',
    full_name: profile.full_name || '',
    avatar_url: profile.avatar_url,
    role: profile.role as "admin" | "agent" | "seller" | "buyer" | undefined,
    phone: profile.phone
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
