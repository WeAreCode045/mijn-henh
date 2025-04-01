
import React from "react";
import { SubmissionCard } from "./SubmissionCard";

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

interface SubmissionsListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelect: (id: string) => void;
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function SubmissionsList({
  contacts,
  selectedContactId,
  onSelect,
  onMarkAsRead,
  onDelete
}: SubmissionsListProps) {
  return (
    <div className="space-y-4">
      {contacts.map(contact => (
        <SubmissionCard
          key={contact.id}
          contact={contact}
          isSelected={selectedContactId === contact.id}
          onSelect={onSelect}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
