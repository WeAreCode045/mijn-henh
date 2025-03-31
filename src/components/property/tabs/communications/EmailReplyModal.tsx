
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
  const [smtpConfigured, setSmtpConfigured] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  // Update recipient whenever props change
  useEffect(() => {
    setTo(recipientEmail);
  }, [recipientEmail]);

  // Check if SMTP is configured
  useEffect(() => {
    const checkSmtpSettings = async () => {
      const { data, error } = await supabase
        .from('agency_settings')
        .select('smtp_host, smtp_username, smtp_password')
        .single();
        
      if (error) {
        console.error('Error checking SMTP settings:', error);
        return;
      }
      
      if (!data?.smtp_host || !data?.smtp_username || !data?.smtp_password) {
        setSmtpConfigured(false);
      }
    };
    
    checkSmtpSettings();
  }, []);

  const handleSendEmail = async () => {
    if (!smtpConfigured) {
      toast({
        title: "SMTP Not Configured",
        description: "Please configure SMTP settings in the Advanced tab of Settings first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    if (!to.trim()) {
      toast({
        title: "No Recipient",
        description: "Please enter at least one recipient email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // First save the reply to the database
      const { error: replyError } = await supabase
        .from('property_submission_replies')
        .insert({
          submission_id: submissionId,
          reply_text: message,
          user_id: user?.id
        });
        
      if (replyError) throw replyError;
      
      // Call edge function to send email
      const { error: sendError } = await supabase.functions.invoke('send-email-with-smtp', {
        body: {
          to: to,
          subject: subject,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <p>Hello ${recipientName},</p>
            <div style="white-space: pre-wrap;">${message}</div>
            <p style="margin-top: 20px; color: #666;">Regarding your inquiry about ${propertyTitle}</p>
            ${profile?.full_name ? `<p style="margin-top: 10px;">Best regards,<br>${profile.full_name}</p>` : ''}
          </div>`,
          cc: cc ? cc.split(',').map(email => email.trim()).filter(email => email) : undefined
        }
      });
      
      if (sendError) throw new Error('Failed to send email. Please try again.');
      
      // Mark submission as read
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);
        
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
      toast({
        title: "Error",
        description: error.message || "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply by Email</DialogTitle>
          <DialogDescription>
            Send an email to {recipientName} ({recipientEmail})
          </DialogDescription>
        </DialogHeader>
        
        {!smtpConfigured && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-md mb-4">
            <p className="text-sm font-medium">SMTP is not configured</p>
            <p className="text-xs">Go to Settings &gt; Advanced tab to configure your SMTP settings.</p>
          </div>
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
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || !smtpConfigured || !message.trim() || !to.trim()}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
