
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgencySettings } from '@/types/agency';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmtpSettings } from './SmtpSettings';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MailTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MailTab({ settings, onChange }: MailTabProps) {
  const hasMailjetConfig = !!settings.mailjetApiKey && !!settings.mailjetApiSecret;
  const hasSmtpConfig = !!settings.smtpHost && !!settings.smtpUsername && !!settings.smtpPassword;
  
  // Create a handler specifically for Switch components
  const handleSwitchChange = (name: string, checked: boolean) => {
    // Create a synthetic event that matches what onChange expects
    const syntheticEvent = {
      target: {
        name,
        value: checked,
        type: 'checkbox',
        checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="mailjet" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="mailjet">Mailjet</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mailjet" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mailjet Configuration
                {hasMailjetConfig && (
                  <span className="text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Configured
                  </span>
                )}
              </CardTitle>
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

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Mailjet will be used as the primary email service if configured, with SMTP as a fallback if needed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="smtp" className="pt-4">
          <SmtpSettings 
            settings={settings} 
            onChange={onChange} 
            onSwitchChange={handleSwitchChange} 
          />
        </TabsContent>
      </Tabs>

      {!hasMailjetConfig && !hasSmtpConfig && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No email service is configured. Please configure either Mailjet or SMTP to enable email sending functionality.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
