
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgencySettings } from '@/types/agency';

interface MailTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MailTab({ settings, onChange }: MailTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mailjet Configuration</CardTitle>
          <CardDescription>
            Configure your Mailjet API credentials to send emails from your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mailjetApiKey">Mailjet API Key</Label>
              <Input
                id="mailjetApiKey"
                name="mailjetApiKey"
                value={settings.mailjetApiKey || ""}
                onChange={onChange}
                placeholder="Enter your Mailjet API Key"
                type="password"
              />
              <p className="text-sm text-muted-foreground">
                Your Mailjet API Key from your Mailjet account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mailjetApiSecret">Mailjet API Secret</Label>
              <Input
                id="mailjetApiSecret"
                name="mailjetApiSecret"
                value={settings.mailjetApiSecret || ""}
                onChange={onChange}
                placeholder="Enter your Mailjet API Secret"
                type="password"
              />
              <p className="text-sm text-muted-foreground">
                Your Mailjet API Secret from your Mailjet account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mailjetFromEmail">From Email</Label>
              <Input
                id="mailjetFromEmail"
                name="mailjetFromEmail"
                value={settings.mailjetFromEmail || ""}
                onChange={onChange}
                placeholder="noreply@yourdomain.com"
              />
              <p className="text-sm text-muted-foreground">
                The email address that will be used as the sender
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mailjetFromName">From Name</Label>
              <Input
                id="mailjetFromName"
                name="mailjetFromName"
                value={settings.mailjetFromName || ""}
                onChange={onChange}
                placeholder="Your Company Name"
              />
              <p className="text-sm text-muted-foreground">
                The name that will appear as the sender
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
