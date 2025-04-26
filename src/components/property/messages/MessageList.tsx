
import { usePropertyMessages } from "@/hooks/useMessages";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";

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
    sendMessage 
  } = usePropertyMessages(propertyId, selectedParticipantId);

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
        <MessageThread
          messages={messages || []}
          isLoading={isLoadingMessages}
          selectedParticipantId={selectedParticipantId}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
