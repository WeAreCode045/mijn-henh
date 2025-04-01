
import { Badge } from "@/components/ui/badge";

export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body?: string;
  isRead: boolean;
}

interface EmailItemProps {
  email: Email;
  onSelect: (email: Email) => void;
  isSelected: boolean;
}

export const EmailItem = ({ email, onSelect, isSelected }: EmailItemProps) => {
  const date = new Date(email.date);
  const formattedDate = date.toLocaleDateString();
  
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer mb-2 ${isSelected ? 'border-primary bg-accent' : email.isRead ? 'bg-background' : 'bg-accent'}`}
      onClick={() => onSelect(email)}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className={`font-medium ${!email.isRead ? 'font-bold' : ''}`}>{email.from}</h3>
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </div>
      <p className={`text-sm mb-1 line-clamp-1 ${!email.isRead ? 'font-semibold' : ''}`}>{email.subject}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground line-clamp-1">{email.body ? (email.body.substring(0, 50) + "...") : ""}</span>
        {!email.isRead && (
          <Badge variant="default" className="ml-2">New</Badge>
        )}
      </div>
    </div>
  );
};
