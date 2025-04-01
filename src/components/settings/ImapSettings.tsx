
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { AgencySettings } from '@/types/agency';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImapSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function ImapSettings({ settings, onChange, onSwitchChange }: ImapSettingsProps) {
  const hasImapConfig = Boolean(settings.imapHost && settings.imapUsername && settings.imapPassword);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();
  
  const testConnection = async () => {
    if (!settings.imapHost || !settings.imapPort || !settings.imapUsername || !settings.imapPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before testing the connection.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsTestingConnection(true);
      setConnectionStatus(null);
      
      const { data, error } = await supabase.functions.invoke("fetch-imap-emails", {
        body: {
          imapHost: settings.imapHost,
          imapPort: settings.imapPort || "993",
          imapUsername: settings.imapUsername,
          imapPassword: settings.imapPassword,
          imapTls: settings.imapTls !== false,
          imapMailbox: settings.imapMailbox || "INBOX",
          testConnection: true
        }
      });

      if (error) {
        console.error("Connection test error:", error);
        setConnectionStatus({
          success: false,
          message: error.message || "Connection failed"
        });
        toast({
          title: "Connection Failed",
          description: "Could not connect to the IMAP server. Please check your settings and try again.",
          variant: "destructive",
        });
      } else {
        console.log("Connection test result:", data);
        setConnectionStatus({
          success: true,
          message: "Successfully connected to the IMAP server"
        });
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the IMAP server.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      setConnectionStatus({
        success: false,
        message: error.message || "An unknown error occurred"
      });
      toast({
        title: "Connection Error",
        description: error.message || "An unknown error occurred while testing the connection.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  
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
        
        <Button 
          onClick={testConnection} 
          type="button" 
          variant="outline" 
          disabled={isTestingConnection}
          className="mt-4"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>Test Connection</>
          )}
        </Button>
        
        {connectionStatus && (
          <Alert variant={connectionStatus.success ? "default" : "destructive"} className="mt-2">
            {connectionStatus.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {connectionStatus.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
