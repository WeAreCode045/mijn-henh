
import { Mail } from "lucide-react";
import { Email } from "./EmailItem";

interface EmailDetailProps {
  email: Email | null;
}

export const EmailDetail = ({ email }: EmailDetailProps) => {
  if (!email) {
    return (
      <div className="flex items-center justify-center h-[400px] p-6 border rounded-md text-center text-muted-foreground">
        <div>
          <Mail className="mx-auto h-10 w-10 mb-4" />
          <p>Select an email to view details</p>
        </div>
      </div>
    );
  }

  const date = new Date(email.date).toLocaleString();

  return (
    <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
      <div className="mb-4 pb-2 border-b">
        <h2 className="text-xl font-bold mb-2">{email.subject}</h2>
        <div className="flex justify-between items-center text-sm">
          <span><strong>From:</strong> {email.from}</span>
          <span className="text-muted-foreground">{date}</span>
        </div>
        <div className="text-sm">
          <span><strong>To:</strong> {email.to}</span>
        </div>
      </div>
      <div className="prose prose-sm max-w-none">
        {email.body ? (
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
};
