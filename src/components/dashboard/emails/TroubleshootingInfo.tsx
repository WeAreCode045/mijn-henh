
import { AlertCircle } from "lucide-react";
import { AgencySettings } from "@/types/agency";

interface TroubleshootingInfoProps {
  settings: AgencySettings;
}

export const TroubleshootingInfo = ({ settings }: TroubleshootingInfoProps) => {
  return (
    <div className="mb-4 p-4 border border-yellow-400 bg-yellow-50 rounded-md">
      <h3 className="font-bold flex items-center text-yellow-800">
        <AlertCircle className="h-5 w-5 mr-2" />
        Troubleshooting Mode
      </h3>
      <p className="mt-2 text-sm">
        We're showing you a test email because there might be an issue with your IMAP settings or 
        connectivity. Please verify your IMAP settings in the Settings page:
      </p>
      <ul className="mt-2 text-sm list-disc list-inside space-y-1 ml-2">
        <li>Host: {settings.imapHost}</li>
        <li>Port: {settings.imapPort || "993"}</li>
        <li>Username: {settings.imapUsername}</li>
        <li>TLS Enabled: {settings.imapTls !== false ? "Yes" : "No"}</li>
        <li>Mailbox: {settings.imapMailbox || "INBOX"}</li>
      </ul>
      <p className="mt-2 text-sm">
        Common issues include:
      </p>
      <ul className="mt-1 text-sm list-disc list-inside space-y-1 ml-2">
        <li>Incorrect password</li>
        <li>IMAP not enabled on your email account</li>
        <li>Port restrictions on the server</li>
        <li>Two-factor authentication requiring an app password</li>
        <li>Email provider security settings blocking external access</li>
      </ul>
    </div>
  );
};
