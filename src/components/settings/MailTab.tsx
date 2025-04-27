
import { EmailSection } from "./EmailSection";
import { AgencySettings } from "@/types/agency";

interface MailTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function MailTab({ settings, onChange, onSwitchChange }: MailTabProps) {
  return (
    <div>
      <h2 className="text-xl font-bold">Email Settings</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure your email server settings for sending emails.
      </p>
      
      <EmailSection 
        settings={settings}
        onChange={onChange}
        onSwitchChange={(name) => (checked: boolean) => onSwitchChange(name, checked)}
      />
    </div>
  );
}
