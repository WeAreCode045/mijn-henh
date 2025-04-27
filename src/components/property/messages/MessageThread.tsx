import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { User } from "@/types/user";
import { PropertyMessage } from "@/types/message";
import { Skeleton } from "@/components/ui/skeleton";

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
  error?: Error | null;
  selectedParticipantId?: string | null;
}

export function MessageThread({
  messages,
  currentUser,
  onSendMessage,
  propertyId,
  isLoading = false,
  error = null,
  selectedParticipantId = null
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      setIsSending(true);
      try {
        await onSendMessage(newMessage);
        setNewMessage("");
      } finally {
        setIsSending(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-[300px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading messages</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!selectedParticipantId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-500">Select a conversation to view messages</p>
      </div>
    );
  }

  const normalizedMessages = messages.map(msg => {
    if ('message' in msg) {
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
    return msg as Message;
  });

  const groupedMessages = normalizedMessages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

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
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
