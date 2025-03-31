
import React from 'react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            <FormItem>
              <FormLabel>Mailjet API Key</FormLabel>
              <FormControl>
                <Input
                  name="mailjetApiKey"
                  value={settings.mailjetApiKey || ""}
                  onChange={onChange}
                  placeholder="Enter your Mailjet API Key"
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Your Mailjet API Key from your Mailjet account
              </FormDescription>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Mailjet API Secret</FormLabel>
              <FormControl>
                <Input
                  name="mailjetApiSecret"
                  value={settings.mailjetApiSecret || ""}
                  onChange={onChange}
                  placeholder="Enter your Mailjet API Secret"
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Your Mailjet API Secret from your Mailjet account
              </FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>From Email</FormLabel>
              <FormControl>
                <Input
                  name="mailjetFromEmail"
                  value={settings.mailjetFromEmail || ""}
                  onChange={onChange}
                  placeholder="noreply@yourdomain.com"
                />
              </FormControl>
              <FormDescription>
                The email address that will be used as the sender
              </FormDescription>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>From Name</FormLabel>
              <FormControl>
                <Input
                  name="mailjetFromName"
                  value={settings.mailjetFromName || ""}
                  onChange={onChange}
                  placeholder="Your Company Name"
                />
              </FormControl>
              <FormDescription>
                The name that will appear as the sender
              </FormDescription>
              <FormMessage />
            </FormItem>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
