
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface EmailReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  propertyId: string;
  propertyTitle: string;
  submissionId: string;
}

export function EmailReplyModal({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  propertyId,
  propertyTitle,
  submissionId
}: EmailReplyModalProps) {
  const [subject, setSubject] = useState(`RE: Inquiry about ${propertyTitle}`);
  const [message, setMessage] = useState('');
  const [cc, setCc] = useState('');
  const [to, setTo] = useState(recipientEmail);
  const [isSending, setIsSending] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [resendConfigured, setResendConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  // Update recipient whenever props change
  useEffect(() => {
    if (recipientEmail) {
      setTo(recipientEmail);
    }
  }, [recipientEmail]);

  // Check if email sending is configured
  useEffect(() => {
    const checkEmailSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('agency_settings')
          .select('smtp_host, smtp_username, smtp_password, resend_api_key')
          .single();
          
        if (error) {
          console.error('Error checking email settings:', error);
          return;
        }
        
        setSmtpConfigured(!!(data?.smtp_host && data?.smtp_username && data?.smtp_password));
        setResendConfigured(!!data?.resend_api_key);
      } catch (err) {
        console.error('Failed to check email settings:', err);
      }
    };
    
    checkEmailSettings();
  }, []);

  const handleSendEmail = async () => {
    if (!smtpConfigured && !resendConfigured) {
      setError("Email sending is not configured. Please configure SMTP or Resend settings in the Mail tab of Settings first.");
      return;
    }
    
    if (!message.trim()) {
      setError("Please enter a message before sending.");
      return;
    }
    
    if (!to.trim()) {
      setError("Please enter at least one recipient email address.");
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // First save the reply to the database
      const { data: replyData, error: replyError } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: message,
          user_id: user?.id,
          agent_id: user?.id
        })
        .select()
        .single();
        
      if (replyError) throw replyError;
      
      // Call edge function to send email with custom recipient
      const { error: sendError, data: sendData } = await supabase.functions.invoke('send-submission-reply', {
        body: {
          replyId: replyData.id,
          recipientEmail: to // Pass the custom recipient email
        }
      });
      
      if (sendError) {
        console.error('Edge function error:', sendError);
        throw new Error('Failed to send email. Please try again.');
      }
      
      console.log('Email sent successfully:', sendData);
      
      toast({
        title: "Success",
        description: "Your reply has been sent successfully.",
      });
      
      // Close the modal and clear form
      onClose();
      setMessage('');
      setCc('');
    } catch (error: any) {
      console.error('Error sending email:', error);
      setError(error.message || "Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isEmailConfigured = smtpConfigured || resendConfigured;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply by Email</DialogTitle>
          <DialogDescription>
            Send an email to {recipientName} ({recipientEmail})
          </DialogDescription>
        </DialogHeader>
        
        {!isEmailConfigured && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email sending is not configured</AlertTitle>
            <AlertDescription>
              Go to Settings &gt; Mail tab to configure your email settings.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cc" className="text-right">
              CC
            </Label>
            <Input
              id="cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={8}
              placeholder="Type your reply here..."
              required
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || !isEmailConfigured || !message.trim() || !to.trim()}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
