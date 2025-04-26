
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyMessage, Conversation } from '@/types/message';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';

export function usePropertyMessages(propertyId?: string, participantId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Listen for new messages in real-time
  useEffect(() => {
    if (!propertyId) return;

    const channel = supabase
      .channel('property-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_messages',
          filter: `property_id=eq.${propertyId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['property-messages', propertyId, participantId] });
          queryClient.invalidateQueries({ queryKey: ['property-conversations', propertyId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, participantId, queryClient]);

  // Get conversations (grouped by participant)
  const {
    data: conversations,
    isLoading: conversationsLoading
  } = useQuery({
    queryKey: ['property-conversations', propertyId],
    queryFn: async () => {
      if (!propertyId || !user?.id) return [];

      // Get all messages for this property where current user is sender or recipient
      const { data, error } = await supabase
        .from('property_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, email, avatar_url),
          recipient:profiles!recipient_id(id, full_name, email, avatar_url)
        `)
        .eq('property_id', propertyId)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Get property details
      const { data: propertyData } = await supabase
        .from('properties')
        .select('title')
        .eq('id', propertyId)
        .single();

      // Group by participant (the other person in the conversation)
      const conversationMap = new Map<string, PropertyMessage[]>();
      
      (data as PropertyMessage[]).forEach(message => {
        const participantId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        if (!conversationMap.has(participantId)) {
          conversationMap.set(participantId, []);
        }
        conversationMap.get(participantId)?.push(message);
      });

      // Format conversations
      return Array.from(conversationMap.entries()).map(([participantId, messages]) => {
        const lastMessage = messages[0]; // Messages are ordered by created_at desc
        const participant = lastMessage.sender_id === user.id ? lastMessage.recipient : lastMessage.sender;
        const unreadCount = messages.filter(m => m.recipient_id === user.id && !m.is_read).length;

        return {
          participantId,
          participantName: participant?.full_name || 'Unknown',
          participantEmail: participant?.email || '',
          participantAvatar: participant?.avatar_url,
          lastMessage: lastMessage.message,
          lastMessageDate: lastMessage.created_at,
          unreadCount,
          propertyId,
          propertyTitle: propertyData?.title || 'Unknown Property'
        };
      });
    },
    enabled: !!propertyId && !!user?.id,
  });

  // Get messages between current user and selected participant
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError
  } = useQuery({
    queryKey: ['property-messages', propertyId, participantId],
    queryFn: async () => {
      if (!propertyId || !participantId || !user?.id) return [];

      // Get messages between current user and selected participant for this property
      const { data, error } = await supabase
        .from('property_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, email, avatar_url),
          recipient:profiles!recipient_id(id, full_name, email, avatar_url)
        `)
        .eq('property_id', propertyId)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${participantId}),and(sender_id.eq.${participantId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Mark unread messages as read
      const unreadMessageIds = data
        .filter(m => m.recipient_id === user.id && !m.is_read)
        .map(m => m.id);

      if (unreadMessageIds.length > 0) {
        await supabase
          .from('property_messages')
          .update({ is_read: true })
          .in('id', unreadMessageIds);
      }

      return data as PropertyMessage[];
    },
    enabled: !!propertyId && !!participantId && !!user?.id,
  });

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      recipientId, 
      message 
    }: { 
      recipientId: string;
      message: string;
    }) => {
      if (!propertyId || !user?.id) {
        throw new Error('Missing required parameters');
      }

      const { data, error } = await supabase
        .from('property_messages')
        .insert({
          property_id: propertyId,
          sender_id: user.id,
          recipient_id: recipientId,
          message
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-messages', propertyId, participantId] });
      queryClient.invalidateQueries({ queryKey: ['property-conversations', propertyId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  return {
    conversations,
    messages,
    isLoadingConversations: conversationsLoading,
    isLoadingMessages: messagesLoading,
    messagesError,
    sendMessage: sendMessageMutation.mutate,
    hasUnreadMessages: conversations?.some(conv => conv.unreadCount > 0) || false
  };
}
