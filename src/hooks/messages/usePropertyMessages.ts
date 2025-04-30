
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export interface Participant {
  id: string;
  full_name?: string;
  email?: string; 
  avatar_url?: string;
  phone?: string;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyMessage {
  id: string;
  message: string;
  sender_id: string;
  recipient_id: string;
  property_id: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: Participant;
  recipient: Participant;
}

interface SendMessageParams {
  recipientId: string;
  message: string;
}

export function usePropertyMessages(propertyId?: string, participantId?: string | null) {
  const [messages, setMessages] = useState<PropertyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<PropertyMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [conversationsError, setConversationsError] = useState<Error | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<Error | null>(null);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Check if user is admin/agent or buyer/seller
          const { data: accountData } = await supabase
            .from('accounts')
            .select('role')
            .eq('user_id', user.id)
            .single();

          const role = accountData?.role;
          
          if (role === 'admin' || role === 'agent') {
            const { data: profile } = await supabase
              .from('employer_profiles')
              .select('id, first_name, last_name, email, avatar_url, phone, whatsapp_number')
              .eq('id', user.id)
              .single();
              
            if (profile) {
              setCurrentUser({
                id: profile.id,
                email: profile.email || '',
                full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                avatar_url: profile.avatar_url,
                phone: profile.phone,
                whatsapp_number: profile.whatsapp_number,
                role: role
              });
            }
          } else if (role === 'buyer' || role === 'seller') {
            const { data: profile } = await supabase
              .from('participants_profile')
              .select('id, first_name, last_name, email, phone, whatsapp_number')
              .eq('id', user.id)
              .single();
              
            if (profile) {
              setCurrentUser({
                id: profile.id,
                email: profile.email || '',
                full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                phone: profile.phone,
                whatsapp_number: profile.whatsapp_number,
                role: role
              });
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch conversations (list of people the user has chatted with)
  useEffect(() => {
    const fetchConversations = async () => {
      if (!propertyId) return;

      setIsLoadingConversations(true);
      setConversationsError(null);

      try {
        // Get messages for this property
        const { data: messages, error: messagesError } = await supabase
          .from('property_messages')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        if (!messages || messages.length === 0) {
          setConversations([]);
          setIsLoadingConversations(false);
          return;
        }
        
        // We'll fetch user profiles separately and combine them
        const senderIds = [...new Set(messages.map(m => m.sender_id))];
        const recipientIds = [...new Set(messages.map(m => m.recipient_id))];
        const allUserIds = [...new Set([...senderIds, ...recipientIds])];
        
        // Get all relevant user profiles - first check employer_profiles
        const { data: employerProfiles, error: employerError } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', allUserIds);
        
        if (employerError) throw employerError;
        
        // Also check participants_profile
        const { data: participantProfiles, error: participantError } = await supabase
          .from('participants_profile')
          .select('id, first_name, last_name, email')
          .in('id', allUserIds);
        
        if (participantError) throw participantError;
        
        // Combine both profile types into one map
        const userMap = new Map();
        if (employerProfiles) {
          employerProfiles.forEach(profile => {
            userMap.set(profile.id, {
              id: profile.id,
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
              email: profile.email || '',
              avatar_url: profile.avatar_url || ''
            });
          });
        }
        
        if (participantProfiles) {
          participantProfiles.forEach(profile => {
            if (!userMap.has(profile.id)) {
              userMap.set(profile.id, {
                id: profile.id,
                full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
                email: profile.email || '',
              });
            }
          });
        }
        
        // Build full messages with sender and recipient info
        const messagesWithUserInfo = messages.map(message => {
          const sender = userMap.get(message.sender_id) || {
            id: message.sender_id,
            full_name: 'Unknown User'
          };
          
          const recipient = userMap.get(message.recipient_id) || {
            id: message.recipient_id,
            full_name: 'Unknown User'
          };
          
          return {
            ...message,
            sender,
            recipient
          };
        });
        
        setConversations(messagesWithUserInfo);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        console.error('Error fetching conversations:', error);
        setConversationsError(error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [propertyId]);

  // Fetch messages between current user and selected participant
  useEffect(() => {
    const fetchMessages = async () => {
      if (!propertyId || !participantId || !currentUser) return;

      setIsLoadingMessages(true);
      setMessagesError(null);

      try {
        // Fetch all messages between these two users for this property
        const { data: messagesData, error: messagesError } = await supabase
          .from('property_messages')
          .select('*')
          .eq('property_id', propertyId)
          .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
          .or(`sender_id.eq.${participantId},recipient_id.eq.${participantId}`)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (!messagesData || messagesData.length === 0) {
          setMessages([]);
          setIsLoadingMessages(false);
          return;
        }
        
        // Extract unique user IDs
        const userIds = [...new Set([
          ...messagesData.map(m => m.sender_id),
          ...messagesData.map(m => m.recipient_id)
        ])];
        
        // Get user profiles from employer_profiles
        const { data: employerProfiles, error: employerProfilesError } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', userIds);
        
        if (employerProfilesError) throw employerProfilesError;
        
        // Get user profiles from participants_profile
        const { data: participantProfiles, error: participantProfilesError } = await supabase
          .from('participants_profile')
          .select('id, first_name, last_name, email')
          .in('id', userIds);
        
        if (participantProfilesError) throw participantProfilesError;
        
        // Create a map for quick user lookups
        const userMap = new Map();
        if (employerProfiles) {
          employerProfiles.forEach(profile => {
            userMap.set(profile.id, {
              id: profile.id,
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              email: profile.email,
              avatar_url: profile.avatar_url
            });
          });
        }
        
        if (participantProfiles) {
          participantProfiles.forEach(profile => {
            if (!userMap.has(profile.id)) {
              userMap.set(profile.id, {
                id: profile.id,
                full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                email: profile.email
              });
            }
          });
        }
        
        // Format messages with user info
        const formattedMessages = messagesData.map(msg => {
          const sender = userMap.get(msg.sender_id) || { id: msg.sender_id, full_name: 'Unknown User' };
          const recipient = userMap.get(msg.recipient_id) || { id: msg.recipient_id, full_name: 'Unknown User' };
          
          return {
            ...msg,
            sender,
            recipient
          } as PropertyMessage;
        });
        
        setMessages(formattedMessages);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        console.error('Error fetching messages:', error);
        setMessagesError(error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [propertyId, participantId, currentUser]);

  // Send message function
  const sendMessage = async ({ recipientId, message }: SendMessageParams) => {
    if (!propertyId || !recipientId || !message || !currentUser) {
      throw new Error('Missing required information to send message');
    }

    try {
      const newMessage = {
        property_id: propertyId,
        sender_id: currentUser.id,
        recipient_id: recipientId,
        message,
        is_read: false
      };

      const { error } = await supabase
        .from('property_messages')
        .insert(newMessage);

      if (error) throw error;

      // Refresh messages
      const { data: sentMessage } = await supabase
        .from('property_messages')
        .select('*')
        .eq('property_id', propertyId)
        .eq('sender_id', currentUser.id)
        .eq('recipient_id', recipientId)
        .eq('message', message)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sentMessage) {
        setMessages(prev => [
          ...prev,
          {
            ...sentMessage,
            sender: {
              id: currentUser.id,
              full_name: currentUser.full_name,
              email: currentUser.email,
              avatar_url: currentUser.avatar_url
            },
            recipient: conversations.find(c => c.sender.id === recipientId || c.recipient.id === recipientId)?.sender || {
              id: recipientId,
              full_name: 'Recipient'
            }
          }
        ]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    conversations,
    isLoadingConversations,
    isLoadingMessages,
    conversationsError,
    messagesError,
    isLoading,
    error,
    sendMessage,
    currentUser
  };
}
