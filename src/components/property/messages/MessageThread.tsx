
import React, { useState, useEffect, useRef } from "react";
import { PropertyMessage } from "@/types/message";
import { User } from "@/types/user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

interface MessageThreadProps {
  messages: PropertyMessage[];
  isLoading: boolean;
  error: Error | null;
  selectedParticipantId: string | null;
  onSendMessage: (content: string) => Promise<void>;
  propertyId: string;
  currentUser: User;
}

export function MessageThread({
  messages,
  isLoading,
  error,
  selectedParticipantId,
  onSendMessage,
  propertyId,
  currentUser,
}: MessageThreadProps) {
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim() || !selectedParticipantId) return;

    try {
      setIsSending(true);
      await onSendMessage(messageContent);
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-red-500">
          Error loading messages: {error.message}
        </div>
      </div>
    );
  }

  if (!selectedParticipantId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a conversation to view messages
        </div>
      </div>
    );
  }

  const formatMessageDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Send a message to start the conversation.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUser.id;
              const senderName = isCurrentUser 
                ? "You" 
                : message.sender?.full_name || "Unknown User";
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-3 max-w-[80%]">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        {message.sender?.avatar_url ? (
                          <AvatarImage src={message.sender.avatar_url} />
                        ) : null}
                        <AvatarFallback>
                          {(message.sender?.full_name || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <Card className={isCurrentUser ? "bg-primary/10" : ""}>
                        <CardContent className="p-3">
                          <p>{message.message}</p>
                        </CardContent>
                      </Card>
                      <div className="text-xs text-muted-foreground mt-1 flex gap-1">
                        <span>{senderName}</span>
                        <span>•</span>
                        <span>{formatMessageDate(message.created_at)}</span>
                        {message.is_read && isCurrentUser && (
                          <>
                            <span>•</span>
                            <span>Read</span>
                          </>
                        )}
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
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
            className="resize-none min-h-[80px]"
            disabled={isSending || isLoading || !selectedParticipantId}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSending || isLoading || !messageContent.trim() || !selectedParticipantId}
            className="h-10 w-10"
          >
            {isSending ? <Spinner /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
