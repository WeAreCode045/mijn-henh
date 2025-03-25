
import { AgencySettings } from "@/types/agency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SmtpSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function SmtpSettings({ settings, onChange, onSwitchChange }: SmtpSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email SMTP Configuration</CardTitle>
        <CardDescription>
          Configure SMTP settings to send emails for form submissions and replies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              name="smtpHost"
              placeholder="smtp.example.com"
              value={settings.smtpHost || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              name="smtpPort"
              placeholder="587"
              value={settings.smtpPort || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input
              id="smtpUsername"
              name="smtpUsername"
              placeholder="user@example.com"
              value={settings.smtpUsername || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              name="smtpPassword"
              type="password"
              placeholder="Your SMTP password"
              value={settings.smtpPassword || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpFromEmail">From Email Address</Label>
            <Input
              id="smtpFromEmail"
              name="smtpFromEmail"
              placeholder="noreply@youragency.com"
              value={settings.smtpFromEmail || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFromName">From Name</Label>
            <Input
              id="smtpFromName"
              name="smtpFromName"
              placeholder="Your Agency Name"
              value={settings.smtpFromName || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="smtpSecure"
            checked={settings.smtpSecure === true}
            onCheckedChange={(checked) => onSwitchChange('smtpSecure', checked)}
          />
          <Label htmlFor="smtpSecure">Use secure connection (TLS/SSL)</Label>
        </div>
      </CardContent>
    </Card>
  );
}
