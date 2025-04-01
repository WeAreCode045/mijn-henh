
import { Email, EmailItem } from "./EmailItem";
import { Inbox } from "lucide-react";

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  setSelectedEmail: (email: Email) => void;
  isLoading: boolean;
}

export const EmailList = ({ emails, selectedEmail, setSelectedEmail, isLoading }: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div>
          <Inbox className="mx-auto h-10 w-10 mb-4" />
          <p>No emails found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
      {emails.map(email => (
        <EmailItem 
          key={email.id} 
          email={email} 
          onSelect={setSelectedEmail} 
          isSelected={selectedEmail?.id === email.id}
        />
      ))}
    </div>
  );
};
