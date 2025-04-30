
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Participant {
  id: string;
  full_name?: string;
  email?: string; 
  avatar_url?: string;
  phone?: string;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
}

interface Message {
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

export function usePropertyConversations(propertyId?: string) {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!propertyId) return;

      setIsLoading(true);
      setError(null);

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
          setIsLoading(false);
          return;
        }
        
        // We'll fetch user profiles separately and combine them
        const senderIds = [...new Set(messages.map(m => m.sender_id))];
        const recipientIds = [...new Set(messages.map(m => m.recipient_id))];
        const allUserIds = [...new Set([...senderIds, ...recipientIds])];
        
        // Get all relevant user profiles
        const { data: userProfiles, error: profilesError } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', allUserIds);
        
        if (profilesError) throw profilesError;
        
        // Map user IDs to their profiles
        const userMap = new Map();
        if (userProfiles) {
          userProfiles.forEach(profile => {
            userMap.set(profile.id, {
              id: profile.id,
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
              email: profile.email || '',
              avatar_url: profile.avatar_url || ''
            });
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
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [propertyId]);

  return {
    conversations,
    isLoading,
    error
  };
}
