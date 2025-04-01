
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Check } from 'lucide-react';
import { AgencySettings } from '@/types/agency';

interface ImapSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function ImapSettings({ settings, onChange, onSwitchChange }: ImapSettingsProps) {
  const hasImapConfig = !!settings.imapHost && !!settings.imapUsername && !!settings.imapPassword;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          IMAP Configuration
          {hasImapConfig && (
            <span className="text-sm text-green-600 flex items-center">
              <Check className="w-4 h-4 mr-1" /> Configured
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Set up IMAP to fetch emails automatically from your mail server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imapHost">IMAP Server</Label>
          <Input
            id="imapHost"
            name="imapHost"
            value={settings.imapHost || ""}
            onChange={onChange}
            placeholder="imap.example.com"
          />
          <p className="text-sm text-muted-foreground">
            The hostname or IP address of your IMAP server
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imapPort">Port</Label>
          <Input
            id="imapPort"
            name="imapPort"
            value={settings.imapPort || ""}
            onChange={onChange}
            placeholder="993"
            type="number"
          />
          <p className="text-sm text-muted-foreground">
            The port number to connect to (typically 993 for secured IMAP)
          </p>
        </div>

        <div className="flex items-center space-x-2 my-4">
          <Switch
            id="imapTls"
            name="imapTls"
            checked={settings.imapTls !== false}
            onCheckedChange={(checked) => onSwitchChange('imapTls', checked)}
          />
          <Label htmlFor="imapTls">Use TLS/SSL</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imapUsername">Username</Label>
          <Input
            id="imapUsername"
            name="imapUsername"
            value={settings.imapUsername || ""}
            onChange={onChange}
            placeholder="user@example.com"
          />
          <p className="text-sm text-muted-foreground">
            Your IMAP account username
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imapPassword">Password</Label>
          <Input
            id="imapPassword"
            name="imapPassword"
            value={settings.imapPassword || ""}
            onChange={onChange}
            type="password"
            placeholder="••••••••••••"
          />
          <p className="text-sm text-muted-foreground">
            Your IMAP account password
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imapMailbox">Mailbox</Label>
          <Input
            id="imapMailbox"
            name="imapMailbox"
            value={settings.imapMailbox || ""}
            onChange={onChange}
            placeholder="INBOX"
          />
          <p className="text-sm text-muted-foreground">
            The mailbox to monitor for new emails (default: INBOX)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
