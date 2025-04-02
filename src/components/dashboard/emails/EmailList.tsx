
import { Email, EmailItem } from "./EmailItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction } from "react";

export interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  selectedEmail: Email | null;
  setSelectedEmail: Dispatch<SetStateAction<Email | null>>;
}

export const EmailList = ({ emails, isLoading, selectedEmail, setSelectedEmail }: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-20" />
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return <div className="text-center py-4">No emails found</div>;
  }

  return (
    <div className="space-y-2">
      {emails.map((email) => (
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
