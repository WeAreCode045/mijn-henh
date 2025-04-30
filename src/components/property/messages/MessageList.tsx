
import { usePropertyMessages } from "@/hooks/messages/usePropertyMessages";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";
import { PropertyMessage, Conversation } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@/types/user";

interface MessageListProps {
  propertyId: string;
}

export function MessageList({ propertyId }: MessageListProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    conversations: rawConversations, 
    messages, 
    isLoadingConversations, 
    isLoadingMessages,
    conversationsError,
    messagesError, 
    sendMessage,
    currentUser
  } = usePropertyMessages(propertyId, selectedParticipantId);
  
  // Transform PropertyMessage[] into Conversation[] format
  const conversations: Conversation[] = (rawConversations || []).map(conv => {
    // Determine participant (the person who is not the current user)
    const isCurrentUserSender = conv.sender_id === currentUser?.id;
    const participant = isCurrentUserSender ? conv.recipient : conv.sender;
    
    return {
      participantId: participant.id,
      participantName: participant.full_name || 'Unknown User',
      participantEmail: participant.email || '',
      participantAvatar: participant.avatar_url,
      lastMessage: conv.message,
      lastMessageDate: conv.created_at,
      unreadCount: conv.is_read ? 0 : 1,
      propertyId: conv.property_id,
      propertyTitle: ''  // We don't have property title in the message, defaulting to empty
    };
  });

  // Wrapper for sendMessage function to handle errors
  const handleSendMessage = async (content: string) => {
    if (selectedParticipantId && content) {
      try {
        await sendMessage({ recipientId: selectedParticipantId, message: content });
      } catch (error) {
        toast({
          title: "Error sending message",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  // Show error state if there's an error loading conversations
  if (conversationsError) {
    return (
      <div className="h-[600px] border rounded-md p-4 flex items-center justify-center text-red-600">
        Error loading conversations: {conversationsError.message}
      </div>
    );
  }

  return (
    <div className="h-[600px] border rounded-md grid grid-cols-3 overflow-hidden">
      <div className="border-r">
        <ConversationList
          conversations={conversations}
          isLoading={isLoadingConversations}
          selectedParticipantId={selectedParticipantId}
          onSelectParticipant={setSelectedParticipantId}
        />
      </div>
      <div className="col-span-2 flex flex-col">
        {currentUser && (
          <MessageThread
            messages={messages || []}
            isLoading={isLoadingMessages}
            error={messagesError}
            selectedParticipantId={selectedParticipantId}
            onSendMessage={handleSendMessage}
            propertyId={propertyId}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}
