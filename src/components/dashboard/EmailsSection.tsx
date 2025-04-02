
import { CardContent } from "@/components/ui/card";
import { EmailDetail } from "./emails/EmailDetail";
import { EmailList } from "./emails/EmailList";
import { ErrorDisplay } from "./emails/ErrorDisplay";
import { EmailHeader } from "./emails/EmailHeader";
import { useEmails } from "./emails/useEmails";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export function EmailsSection() {
  const { settings } = useAgencySettings();
  const { 
    emails, 
    isLoading, 
    error, 
    selectedEmail, 
    setSelectedEmail, 
    fetchEmails, 
    hasNylasConfig,
    hasImapConfig
  } = useEmails();

  // Check if we have a mock email (single email with id "mock-1")
  const hasMockEmail = emails.length === 1 && emails[0]?.id === "mock-1";

  return (
    <CardContent>
      <EmailHeader 
        fetchEmails={fetchEmails} 
        isLoading={isLoading} 
        isConfigured={!!hasNylasConfig}
      />

      {hasMockEmail && (
        <div className="mb-4 p-4 border border-yellow-400 bg-yellow-50 rounded-md">
          <h3 className="font-bold flex items-center text-yellow-800">
            Troubleshooting Mode
          </h3>
          <p className="mt-2 text-sm">
            We're showing you a test email. Please verify your Nylas settings in the Settings page.
          </p>
        </div>
      )}

      {error && !hasMockEmail ? (
        <ErrorDisplay errorMessage={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email List - Left Side */}
          <div className="md:col-span-1">
            <EmailList 
              emails={emails} 
              selectedEmail={selectedEmail} 
              setSelectedEmail={setSelectedEmail} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Email Detail - Right Side */}
          <div className="md:col-span-2">
            <EmailDetail email={selectedEmail} />
          </div>
        </div>
      )}
    </CardContent>
  );
}
