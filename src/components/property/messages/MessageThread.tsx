
import { PropertyMessage } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatRelative } from "date-fns";

interface MessageThreadProps {
  messages: PropertyMessage[];
  isLoading: boolean;
  selectedParticipantId: string | null;
  onSendMessage: (data: { recipientId: string; message: string }) => void;
}

export function MessageThread({
  messages,
  isLoading,
  selectedParticipantId,
  onSendMessage,
}: MessageThreadProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const formatMessageDate = (dateString: string) => {
    try {
      return formatRelative(new Date(dateString), new Date());
    } catch (error) {
      return "Unknown date";
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedParticipantId) return;
    
    onSendMessage({
      recipientId: selectedParticipantId,
      message: newMessage.trim()
    });
    
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedParticipantId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
        Select a conversation to start messaging.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        {messages.length > 0 && (
          <h3 className="font-medium">
            {messages[0].sender_id === user?.id 
              ? messages[0].recipient?.full_name 
              : messages[0].sender?.full_name}
          </h3>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Send a message to start the conversation.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8">
                      {isCurrentUser 
                        ? (user?.avatar_url ? <AvatarImage src={user.avatar_url} /> : null)
                        : (message.sender?.avatar_url ? <AvatarImage src={message.sender.avatar_url} /> : null)
                      }
                      <AvatarFallback>
                        {isCurrentUser 
                          ? (user?.full_name?.split(" ").map(n => n[0]).join("") || "U")
                          : (message.sender?.full_name?.split(" ").map(n => n[0]).join("") || "U")
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`px-3 py-2 rounded-lg ${
                        isCurrentUser ? "bg-primary text-white" : "bg-gray-100"
                      }`}>
                        {message.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatMessageDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px]"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
}
