
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AgencySettings } from "@/types/agency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MailTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange?: (name: string, checked: boolean) => void;
}

export function MailTab({
  settings,
  onChange,
  onSwitchChange,
}: MailTabProps) {
  const [activeTab, setActiveTab] = useState("smtp");
  
  // Helper function to handle switch changes
  const handleSwitchChange = (name: string) => (checked: boolean) => {
    if (onSwitchChange) {
      onSwitchChange(name, checked);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Email Configuration</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your email services for sending and receiving emails.
        </p>

        <Tabs defaultValue="smtp" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="imap">IMAP</TabsTrigger>
            <TabsTrigger value="nylas">Nylas API</TabsTrigger>
            <TabsTrigger value="mailjet">Mailjet</TabsTrigger>
          </TabsList>

          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure outgoing email settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        name="smtpHost"
                        placeholder="smtp.example.com"
                        value={settings.smtpHost || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        name="smtpPort"
                        placeholder="587"
                        value={settings.smtpPort || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        name="smtpUsername"
                        placeholder="user@example.com"
                        value={settings.smtpUsername || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        name="smtpPassword"
                        type="password"
                        placeholder="••••••••"
                        value={settings.smtpPassword || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpFromEmail">From Email</Label>
                      <Input
                        id="smtpFromEmail"
                        name="smtpFromEmail"
                        placeholder="noreply@example.com"
                        value={settings.smtpFromEmail || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpFromName">From Name</Label>
                      <Input
                        id="smtpFromName"
                        name="smtpFromName"
                        placeholder="Your Company"
                        value={settings.smtpFromName || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smtpSecure"
                      checked={settings.smtpSecure || false}
                      onCheckedChange={handleSwitchChange("smtpSecure")}
                    />
                    <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imap">
            <Card>
              <CardHeader>
                <CardTitle>IMAP Configuration</CardTitle>
                <CardDescription>Configure incoming email settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imapHost">IMAP Host</Label>
                      <Input
                        id="imapHost"
                        name="imapHost"
                        placeholder="imap.example.com"
                        value={settings.imapHost || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imapPort">IMAP Port</Label>
                      <Input
                        id="imapPort"
                        name="imapPort"
                        placeholder="993"
                        value={settings.imapPort || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imapUsername">IMAP Username</Label>
                      <Input
                        id="imapUsername"
                        name="imapUsername"
                        placeholder="user@example.com"
                        value={settings.imapUsername || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imapPassword">IMAP Password</Label>
                      <Input
                        id="imapPassword"
                        name="imapPassword"
                        type="password"
                        placeholder="••••••••"
                        value={settings.imapPassword || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imapMailbox">IMAP Mailbox</Label>
                      <Input
                        id="imapMailbox"
                        name="imapMailbox"
                        placeholder="INBOX"
                        value={settings.imapMailbox || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="imapTls"
                        checked={settings.imapTls !== false}
                        onCheckedChange={handleSwitchChange("imapTls")}
                      />
                      <Label htmlFor="imapTls">Use SSL/TLS</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nylas">
            <Card>
              <CardHeader>
                <CardTitle>Nylas API Configuration</CardTitle>
                <CardDescription>Connect with the Nylas email platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                    <p className="text-sm text-yellow-800">
                      To use Nylas API, you need to create a Nylas account and configure your application. 
                      <a href="https://developer.nylas.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        Sign up for Nylas
                      </a>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nylasClientId">Nylas Client ID</Label>
                    <Input
                      id="nylasClientId"
                      name="nylasClientId"
                      placeholder="Nylas Client ID"
                      value={settings.nylasClientId || ""}
                      onChange={onChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nylasClientSecret">Nylas Client Secret</Label>
                    <Input
                      id="nylasClientSecret"
                      name="nylasClientSecret"
                      type="password"
                      placeholder="Nylas Client Secret"
                      value={settings.nylasClientSecret || ""}
                      onChange={onChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nylasAccessToken">Nylas Access Token</Label>
                    <Input
                      id="nylasAccessToken"
                      name="nylasAccessToken"
                      type="password"
                      placeholder="Nylas Access Token"
                      value={settings.nylasAccessToken || ""}
                      onChange={onChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can get an access token by authenticating your user through Nylas' hosted authentication flow.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mailjet">
            <Card>
              <CardHeader>
                <CardTitle>Mailjet Configuration</CardTitle>
                <CardDescription>Configure Mailjet email service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mailjetApiKey">Mailjet API Key</Label>
                      <Input
                        id="mailjetApiKey"
                        name="mailjetApiKey"
                        placeholder="Mailjet API Key"
                        value={settings.mailjetApiKey || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailjetApiSecret">Mailjet API Secret</Label>
                      <Input
                        id="mailjetApiSecret"
                        name="mailjetApiSecret"
                        type="password"
                        placeholder="Mailjet API Secret"
                        value={settings.mailjetApiSecret || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mailjetFromEmail">From Email</Label>
                      <Input
                        id="mailjetFromEmail"
                        name="mailjetFromEmail"
                        placeholder="noreply@example.com"
                        value={settings.mailjetFromEmail || ""}
                        onChange={onChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailjetFromName">From Name</Label>
                      <Input
                        id="mailjetFromName"
                        name="mailjetFromName"
                        placeholder="Your Company"
                        value={settings.mailjetFromName || ""}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
