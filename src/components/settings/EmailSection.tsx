
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
                <Label htmlFor="smtp_host">SMTP Host</Label>
                <Input
                  id="smtp_host"
                  name="smtp_host"
                  placeholder="smtp.example.com"
                  value={settings.smtp_host || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port</Label>
                <Input
                  id="smtp_port"
                  name="smtp_port"
                  placeholder="587"
                  value={settings.smtp_port || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_username">SMTP Username</Label>
                <Input
                  id="smtp_username"
                  name="smtp_username"
                  placeholder="user@example.com"
                  value={settings.smtp_username || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_password">SMTP Password</Label>
                <Input
                  id="smtp_password"
                  name="smtp_password"
                  type="password"
                  placeholder="••••••••"
                  value={settings.smtp_password || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_from_email">From Email</Label>
                <Input
                  id="smtp_from_email"
                  name="smtp_from_email"
                  placeholder="noreply@example.com"
                  value={settings.smtp_from_email || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_from_name">From Name</Label>
                <Input
                  id="smtp_from_name"
                  name="smtp_from_name"
                  placeholder="Your Company"
                  value={settings.smtp_from_name || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smtp_secure"
                checked={settings.smtp_secure || false}
                onCheckedChange={onSwitchChange("smtp_secure")}
              />
              <Label htmlFor="smtp_secure">Use SSL/TLS</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imap">
          <div className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imap_host">IMAP Host</Label>
                <Input
                  id="imap_host"
                  name="imap_host"
                  placeholder="imap.example.com"
                  value={settings.imap_host || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imap_port">IMAP Port</Label>
                <Input
                  id="imap_port"
                  name="imap_port"
                  placeholder="993"
                  value={settings.imap_port || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imap_username">IMAP Username</Label>
                <Input
                  id="imap_username"
                  name="imap_username"
                  placeholder="user@example.com"
                  value={settings.imap_username || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imap_password">IMAP Password</Label>
                <Input
                  id="imap_password"
                  name="imap_password"
                  type="password"
                  placeholder="••••••••"
                  value={settings.imap_password || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imap_mailbox">IMAP Mailbox</Label>
                <Input
                  id="imap_mailbox"
                  name="imap_mailbox"
                  placeholder="INBOX"
                  value={settings.imap_mailbox || ""}
                  onChange={onChange}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="imap_tls"
                  checked={settings.imap_tls !== false}
                  onCheckedChange={onSwitchChange("imap_tls")}
                />
                <Label htmlFor="imap_tls">Use SSL/TLS</Label>
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
              <Label htmlFor="nylas_client_id">Nylas Client ID</Label>
              <Input
                id="nylas_client_id"
                name="nylas_client_id"
                placeholder="Nylas Client ID"
                value={settings.nylas_client_id || ""}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nylas_client_secret">Nylas Client Secret</Label>
              <Input
                id="nylas_client_secret"
                name="nylas_client_secret"
                type="password"
                placeholder="Nylas Client Secret"
                value={settings.nylas_client_secret || ""}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nylas_access_token">Nylas Access Token</Label>
              <Input
                id="nylas_access_token"
                name="nylas_access_token"
                type="password"
                placeholder="Nylas Access Token"
                value={settings.nylas_access_token || ""}
                onChange={onChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can get an access token by authenticating your user through Nylas' hosted authentication flow.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mailjet">
          <div className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailjet_api_key">Mailjet API Key</Label>
                <Input
                  id="mailjet_api_key"
                  name="mailjet_api_key"
                  placeholder="Mailjet API Key"
                  value={settings.mailjet_api_key || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mailjet_api_secret">Mailjet API Secret</Label>
                <Input
                  id="mailjet_api_secret"
                  name="mailjet_api_secret"
                  type="password"
                  placeholder="Mailjet API Secret"
                  value={settings.mailjet_api_secret || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailjet_from_email">From Email</Label>
                <Input
                  id="mailjet_from_email"
                  name="mailjet_from_email"
                  placeholder="noreply@example.com"
                  value={settings.mailjet_from_email || ""}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mailjet_from_name">From Name</Label>
                <Input
                  id="mailjet_from_name"
                  name="mailjet_from_name"
                  placeholder="Your Company"
                  value={settings.mailjet_from_name || ""}
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
