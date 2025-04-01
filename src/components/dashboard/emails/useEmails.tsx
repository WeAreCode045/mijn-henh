
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
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  
  const hasImapConfig = Boolean(settings.imapHost && settings.imapUsername && settings.imapPassword);

  const fetchEmails = async () => {
    if (!hasImapConfig) {
      setError("IMAP settings are not configured. Please configure IMAP settings in the Settings page.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching emails with settings:", {
        host: settings.imapHost,
        port: settings.imapPort || "993",
        username: settings.imapUsername,
        // password intentionally omitted
      });

      // Provide a mock email while we work on a more compatible solution
      const mockEmails: Email[] = [
        {
          id: "mock-1",
          subject: "Test Email - IMAP Connection Issue",
          from: "System <system@example.com>",
          to: settings.imapUsername || "user@example.com",
          date: new Date().toISOString(),
          textBody: "We're experiencing an issue with the IMAP connection. Our team is working on a solution. In the meantime, please check your email directly through your email provider.",
          htmlBody: "<p>We're experiencing an issue with the IMAP connection. Our team is working on a solution.</p><p>In the meantime, please check your email directly through your email provider.</p>",
          body: "We're experiencing an issue with the IMAP connection. Our team is working on a solution. In the meantime, please check your email directly through your email provider.",
          isRead: false
        }
      ];
      
      setEmails(mockEmails);
      setSelectedEmail(null);
      
      toast({
        title: "IMAP Connection Issue",
        description: "We're experiencing technical difficulties with the IMAP connection. We're showing you test data for now.",
        variant: "destructive",
      });
      
      // Log the error for reference
      console.error("Note: The current implementation using ImapFlow is not compatible with the Edge Function environment. Consider implementing an EmailEngine API integration.");
      
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
    fetchEmails,
    hasImapConfig
  };
};
