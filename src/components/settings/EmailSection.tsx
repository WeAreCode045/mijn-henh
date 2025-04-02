
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AgencySettings } from "@/types/agency";

interface EmailSectionProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (field: string) => (checked: boolean) => void;
}

export function EmailSection({
  settings,
  onChange,
  onSwitchChange,
}: EmailSectionProps) {
  const [activeTab, setActiveTab] = useState("smtp");

  return (
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
          <div className="space-y-4 mt-4">
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
                onCheckedChange={onSwitchChange("smtpSecure")}
              />
              <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imap">
          <div className="space-y-4 mt-4">
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
                  onCheckedChange={onSwitchChange("imapTls")}
                />
                <Label htmlFor="imapTls">Use SSL/TLS</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nylas">
          <div className="space-y-4 mt-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                To use Nylas API, you need to create a Nylas account and configure your application. 
                <a href="https://developer.nylas.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Sign up for Nylas
                </a>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nylasClientId">Client ID</Label>
              <Input
                id="nylasClientId"
                name="nylasClientId"
                placeholder="Nylas Client ID"
                value={settings.nylasClientId || ""}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nylasApiKey">API Key</Label>
              <Input
                id="nylasApiKey"
                name="nylasApiKey"
                type="password"
                placeholder="Nylas API Key"
                value={settings.nylasApiKey || settings.nylasClientSecret || ""}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nylasGrantId">Grant ID</Label>
              <Input
                id="nylasGrantId"
                name="nylasGrantId"
                type="password"
                placeholder="Nylas Grant ID"
                value={settings.nylasGrantId || settings.nylasAccessToken || ""}
                onChange={onChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can get a Grant ID by authenticating your user through Nylas' hosted authentication flow.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mailjet">
          <div className="space-y-4 mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
