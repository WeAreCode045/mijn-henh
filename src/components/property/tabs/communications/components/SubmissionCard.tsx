
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserIcon, CalendarIcon, CheckIcon, XIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  is_read: boolean;
}

interface SubmissionCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function SubmissionCard({
  contact,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete
}: SubmissionCardProps) {
  return (
    <Card 
      key={contact.id} 
      className={`${contact.is_read ? "" : "border-l-4 border-l-blue-500"} 
                ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="p-4 cursor-pointer" onClick={() => onSelect(contact.id)}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <h3 className="text-lg font-medium">{contact.name}</h3>
            <Badge className="ml-3" variant={
              contact.inquiry_type === 'viewing' ? "default" : 
              contact.inquiry_type === 'question' ? "secondary" : "outline"
            }>
              {contact.inquiry_type.charAt(0).toUpperCase() + contact.inquiry_type.slice(1)}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-700 h-8 w-8"
            onClick={(e) => onDelete(e, contact.id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {formatDate(contact.created_at)}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation(); 
              onMarkAsRead(contact.id, !contact.is_read);
            }}
            className="h-6 text-xs"
          >
            {contact.is_read ? (
              <XIcon className="h-3 w-3 mr-1" />
            ) : (
              <CheckIcon className="h-3 w-3 mr-1" />
            )}
            {contact.is_read ? 'Unread' : 'Read'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
