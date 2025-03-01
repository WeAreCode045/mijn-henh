
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
            <Label htmlFor="smtp_host">SMTP Host</Label>
            <Input
              id="smtp_host"
              name="smtp_host"
              placeholder="smtp.example.com"
              value={settings.smtp_host || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp_port">SMTP Port</Label>
            <Input
              id="smtp_port"
              name="smtp_port"
              placeholder="587"
              value={settings.smtp_port || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_username">SMTP Username</Label>
            <Input
              id="smtp_username"
              name="smtp_username"
              placeholder="user@example.com"
              value={settings.smtp_username || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp_password">SMTP Password</Label>
            <Input
              id="smtp_password"
              name="smtp_password"
              type="password"
              placeholder="Your SMTP password"
              value={settings.smtp_password || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_from_email">From Email Address</Label>
            <Input
              id="smtp_from_email"
              name="smtp_from_email"
              placeholder="noreply@youragency.com"
              value={settings.smtp_from_email || ''}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp_from_name">From Name</Label>
            <Input
              id="smtp_from_name"
              name="smtp_from_name"
              placeholder="Your Agency Name"
              value={settings.smtp_from_name || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="smtp_secure"
            checked={settings.smtp_secure === true}
            onCheckedChange={(checked) => onSwitchChange('smtp_secure', checked)}
          />
          <Label htmlFor="smtp_secure">Use secure connection (TLS/SSL)</Label>
        </div>
      </CardContent>
    </Card>
  );
}
