
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
  
  const hasNylasConfig = Boolean(settings.nylasGrantId || settings.nylasAccessToken);
  const hasImapConfig = Boolean(settings.imapHost);

  const fetchEmails = async () => {
    if (!hasNylasConfig) {
      setError("Nylas API is not configured. Please configure Nylas API in the Settings page.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching emails using Nylas API");

      const { data, error } = await supabase.functions.invoke("fetch-nylas-emails", {
        body: {
          nylasAccessToken: settings.nylasGrantId || settings.nylasAccessToken,
          limit: 20
        }
      });

      if (error) {
        console.error("Error fetching emails:", error);
        throw new Error(error.message || "Failed to fetch emails");
      }

      if (data && data.emails) {
        console.log(`Fetched ${data.emails.length} emails`);
        setEmails(data.emails);
        setSelectedEmail(null);
      } else {
        console.log("No emails found");
        setEmails([]);
        setSelectedEmail(null);
      }
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      
      // Provide a fallback experience with a mock email
      const mockEmails: Email[] = [
        {
          id: "mock-1",
          subject: "Nylas API Connection Issue",
          from: "System <system@example.com>",
          to: settings.imapUsername || "user@example.com",
          date: new Date().toISOString(),
          textBody: "We're experiencing an issue with the Nylas API connection. Please check your API key and settings.",
          htmlBody: "<p>We're experiencing an issue with the Nylas API connection.</p><p>Please check your API key and settings in the Settings page.</p>",
          body: "We're experiencing an issue with the Nylas API connection. Please check your API key and settings.",
          isRead: false
        }
      ];
      
      setEmails(mockEmails);
      
      setError("Failed to fetch emails. Please check your Nylas API settings.");
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please check your Nylas API settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load emails when the component mounts and when API settings change
  useEffect(() => {
    if (hasNylasConfig) {
      fetchEmails();
    } else {
      setError("Nylas API is not configured. Please configure Nylas API in the Settings page.");
      setIsLoading(false);
    }
  }, [settings.nylasGrantId, settings.nylasAccessToken]);

  return {
    emails,
    isLoading,
    error,
    selectedEmail,
    setSelectedEmail,
    fetchEmails,
    hasNylasConfig,
    hasImapConfig
  };
};
