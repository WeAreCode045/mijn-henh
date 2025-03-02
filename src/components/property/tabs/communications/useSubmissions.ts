
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  response?: string;
  response_date?: string;
};

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { settings } = useAgencySettings();

  useEffect(() => {
    fetchSubmissions();
  }, [propertyId]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId: string) => {
    try {
      await supabase
        .from('property_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId);

      setSubmissions(subs => 
        subs.map(sub => sub.id === submissionId ? { ...sub, is_read: true } : sub)
      );
      
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, is_read: true } : null);
      }

      toast({
        title: 'Marked as read',
        description: 'The submission has been marked as read',
      });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark submission as read',
        variant: 'destructive',
      });
    }
  };

  const handleSendResponse = async (responseText: string) => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    setIsSending(true);
    try {
      const hasSMTPSettings = 
        settings.smtp_host && 
        settings.smtp_port && 
        settings.smtp_username && 
        settings.smtp_password && 
        settings.smtp_from_email;
      
      let emailError = null;
      
      if (hasSMTPSettings) {
        try {
          await supabase.functions.invoke('send-email-with-smtp', {
            body: {
              to: selectedSubmission.email,
              subject: `RE: Your inquiry`,
              text: responseText,
              html: `
                <div>
                  <p>${responseText.replace(/\n/g, '<br/>')}</p>
                  <hr/>
                  <p><small>In response to your message: "${selectedSubmission.message}"</small></p>
                </div>
              `,
              smtpSettings: {
                host: settings.smtp_host,
                port: Number(settings.smtp_port),
                username: settings.smtp_username,
                password: settings.smtp_password,
                fromEmail: settings.smtp_from_email,
                fromName: settings.smtp_from_name || settings.name,
                secure: settings.smtp_secure || false
              }
            }
          });
        } catch (error) {
          console.error('Error sending email:', error);
          emailError = error;
        }
      }

      const response_date = new Date().toISOString();
      await supabase
        .from('property_contact_submissions')
        .update({ 
          response: responseText,
          response_date: response_date,
          is_read: true
        })
        .eq('id', selectedSubmission.id);

      if (emailError && !hasSMTPSettings) {
        toast({
          title: 'Response saved but not sent',
          description: 'Email could not be sent. Please configure SMTP settings.',
          variant: 'destructive',
        });
      } else if (emailError) {
        toast({
          title: 'Response saved but email failed',
          description: 'Your response has been saved but the email failed to send.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Response sent',
          description: 'Your response has been saved and sent to the client',
        });
      }

      setSubmissions(subs => 
        subs.map(sub => sub.id === selectedSubmission.id 
          ? { ...sub, response: responseText, response_date: response_date, is_read: true } 
          : sub)
      );
      
      setSelectedSubmission(prev => prev ? { 
        ...prev, 
        response: responseText, 
        response_date: response_date,
        is_read: true 
      } : null);
      
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: 'Error',
        description: 'Failed to send your response',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    isSending,
    handleMarkAsRead,
    handleSendResponse
  };
}
