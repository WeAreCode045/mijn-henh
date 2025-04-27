
import { Conversation } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedParticipantId: string | null;
  onSelectParticipant: (participantId: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  selectedParticipantId,
  onSelectParticipant,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participantName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.participantEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
          {searchTerm
            ? "No conversations match your search."
            : "No conversations yet."}
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.participantId}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedParticipantId === conversation.participantId
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => onSelectParticipant(conversation.participantId)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    {conversation.participantAvatar ? (
                      <AvatarImage src={conversation.participantAvatar} />
                    ) : null}
                    <AvatarFallback>
                      {conversation.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate">
                        {conversation.participantName}
                      </h4>
                      {conversation.lastMessageDate && (
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(conversation.lastMessageDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {conversation.propertyTitle}
                    </div>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <Badge className="rounded-full px-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
