
import { useState, useEffect } from "react";
import { Email } from "./EmailItem";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTroubleshooting, setIsTroubleshooting] = useState<boolean>(false);
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  
  const hasImapConfig = settings.imapHost && settings.imapUsername && settings.imapPassword;

  const fetchEmails = async () => {
    if (!hasImapConfig) {
      setError("IMAP settings are not configured. Please configure IMAP settings in the Settings page.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsTroubleshooting(false);
      
      console.log("Fetching emails with settings:", {
        host: settings.imapHost,
        port: settings.imapPort || "993",
        username: settings.imapUsername,
        // password intentionally omitted
      });

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
        console.log(`Fetched ${data.emails.length} emails`);
        setEmails(data.emails);
        
        // Ensure isTroubleshooting is explicitly set as a boolean
        const showTroubleshooting = data.emails.length === 1 && data.emails[0].id === "mock-1";
        setIsTroubleshooting(Boolean(showTroubleshooting));
      } else {
        console.log("No emails found");
        setEmails([]);
      }
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails. Please check your IMAP settings and ensure the Edge Function is deployed correctly.");
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please check your IMAP settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load emails when the component mounts and when IMAP settings change
  useEffect(() => {
    if (hasImapConfig) {
      fetchEmails();
    } else {
      setError("IMAP settings are not configured. Please configure IMAP settings in the Settings page.");
      setIsLoading(false);
    }
  }, [settings.imapHost, settings.imapUsername, settings.imapPassword]);

  return {
    emails,
    isLoading,
    error,
    selectedEmail,
    setSelectedEmail,
    isTroubleshooting,
    fetchEmails,
    hasImapConfig
  };
};
