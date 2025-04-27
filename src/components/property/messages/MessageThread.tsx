
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { User } from "@/types/user";
import { PropertyMessage } from "@/types/message";

interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  read: boolean;
}

interface MessageThreadProps {
  messages: Message[] | PropertyMessage[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  propertyId: string;
  isLoading?: boolean;
  selectedParticipantId?: string | null;
}

export function MessageThread({
  messages,
  currentUser,
  onSendMessage,
  propertyId,
  isLoading = false,
  selectedParticipantId = null
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Convert PropertyMessage to Message if needed
  const normalizedMessages = messages.map(msg => {
    if ('message' in msg) {
      // This is a PropertyMessage
      return {
        id: msg.id,
        content: msg.message,
        sender: msg.sender || { 
          id: msg.sender_id, 
          full_name: "Unknown", 
          email: "" 
        },
        timestamp: msg.created_at,
        read: msg.is_read
      } as Message;
    }
    // This is already in Message format
    return msg as Message;
  });

  // Group messages by date
  const groupedMessages = normalizedMessages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (isLoading) {
    return <div className="flex items-center justify-center h-full p-8">Loading messages...</div>;
  }

  if (!selectedParticipantId) {
    return <div className="flex items-center justify-center h-full p-8">Select a conversation to view messages</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-2">
            <div className="text-center">
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {date}
              </span>
            </div>
            {groupedMessages[date].map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === currentUser.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[70%] ${
                    message.sender.id === currentUser.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={message.sender.avatar_url} />
                    <AvatarFallback>
                      {message.sender.avatar_url ? "..." : message.sender.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender.id === currentUser.id
                        ? "bg-primary text-primary-foreground mr-2"
                        : "bg-muted ml-2"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {message.sender.full_name}
                    </p>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Card className="mt-4 border-t">
        <CardContent className="p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
