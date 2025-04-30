
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

export function usePropertyMessages(propertyId?: string) {
  const [messages, setMessages] = useState<PropertyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!propertyId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all messages for this property
        const { data: messagesData, error: messagesError } = await supabase
          .from('property_messages')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (!messagesData || messagesData.length === 0) {
          setMessages([]);
          setIsLoading(false);
          return;
        }
        
        // Extract unique user IDs
        const userIds = [...new Set([
          ...messagesData.map(m => m.sender_id),
          ...messagesData.map(m => m.recipient_id)
        ])];
        
        // Get user profiles from employer_profiles
        const { data: userProfiles, error: profilesError } = await supabase
          .from('employer_profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', userIds);
        
        if (profilesError) throw profilesError;
        
        // Create a map for quick user lookups
        const userMap = new Map();
        if (userProfiles) {
          userProfiles.forEach(profile => {
            userMap.set(profile.id, {
              id: profile.id,
              full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              email: profile.email,
              avatar_url: profile.avatar_url
            });
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
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [propertyId]);

  return {
    messages,
    isLoading,
    error
  };
}
