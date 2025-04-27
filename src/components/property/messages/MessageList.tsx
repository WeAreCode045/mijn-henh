import { usePropertyMessages } from "@/hooks/messages/usePropertyMessages";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";
import { PropertyMessage } from "@/types/message";

interface MessageListProps {
  propertyId: string;
}

export function MessageList({ propertyId }: MessageListProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const { 
    conversations, 
    messages, 
    isLoadingConversations, 
    isLoadingMessages, 
    sendMessage,
    currentUser
  } = usePropertyMessages(propertyId, selectedParticipantId);

  // Wrapper for sendMessage function to convert string to expected parameters
  const handleSendMessage = (content: string) => {
    if (selectedParticipantId && content) {
      sendMessage({ recipientId: selectedParticipantId, message: content });
    }
  };

  return (
    <div className="h-[600px] border rounded-md grid grid-cols-3 overflow-hidden">
      <div className="border-r">
        <ConversationList
          conversations={conversations || []}
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
