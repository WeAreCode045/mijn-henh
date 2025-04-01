
import { CardContent } from "@/components/ui/card";
import { EmailDetail } from "./emails/EmailDetail";
import { EmailList } from "./emails/EmailList";
import { TroubleshootingInfo } from "./emails/TroubleshootingInfo";
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
    isTroubleshooting, 
    fetchEmails, 
    hasImapConfig 
  } = useEmails();

  return (
    <CardContent>
      <EmailHeader 
        fetchEmails={fetchEmails} 
        isLoading={isLoading} 
        isConfigured={hasImapConfig}
      />

      {isTroubleshooting === true && <TroubleshootingInfo settings={settings} />}

      {error && !isTroubleshooting ? (
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
