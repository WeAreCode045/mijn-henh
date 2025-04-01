
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, RefreshCw, Inbox, AlertCircle } from "lucide-react";
import { useAgencySettings } from "@/hooks/useAgencySettings";

interface Email {
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

const EmailItem = ({ email, onSelect, isSelected }: EmailItemProps) => {
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

const EmailDetail = ({ email }: { email: Email | null }) => {
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
    <div className="border rounded-lg p-4">
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

export function EmailsSection() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { settings } = useAgencySettings();

  const fetchEmails = async () => {
    if (!settings.imapHost || !settings.imapUsername || !settings.imapPassword) {
      setError("IMAP settings are not configured. Please configure IMAP settings in the Settings page.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke("fetch-imap-emails", {
        body: {
          imapHost: settings.imapHost,
          imapPort: settings.imapPort || "993",
          imapUsername: settings.imapUsername,
          imapPassword: settings.imapPassword,
          imapTls: settings.imapTls !== false,
          imapMailbox: settings.imapMailbox || "INBOX"
        }
      });

      if (error) {
        console.error("Error fetching emails:", error);
        throw new Error(error.message || "Failed to fetch emails");
      }

      if (data && data.emails) {
        setEmails(data.emails);
      } else {
        setEmails([]);
      }
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails. Please check your IMAP settings.");
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please check your IMAP settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load emails when the component mounts
  useEffect(() => {
    fetchEmails();
  }, [settings.imapHost, settings.imapUsername, settings.imapPassword]);

  return (
    <CardContent>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Inbox className="mr-2 h-5 w-5" />
          Email Inbox
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchEmails}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="flex items-center justify-center p-6 border rounded-md text-center text-muted-foreground">
          <div>
            <AlertCircle className="mx-auto h-10 w-10 mb-4 text-destructive" />
            <p>{error}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : emails.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div>
            <Inbox className="mx-auto h-10 w-10 mb-4" />
            <p>No emails found</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email List - Left Side */}
          <div className="md:col-span-1 space-y-2 h-[400px] overflow-y-auto pr-2">
            {emails.map(email => (
              <EmailItem 
                key={email.id} 
                email={email} 
                onSelect={setSelectedEmail} 
                isSelected={selectedEmail?.id === email.id}
              />
            ))}
          </div>
          
          {/* Email Detail - Right Side */}
          <div className="md:col-span-2 h-[400px] overflow-y-auto">
            <EmailDetail email={selectedEmail} />
          </div>
        </div>
      )}
    </CardContent>
  );
}
