
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "../types";
import { AgencySettings } from "@/types/agency";

interface UseSendResponseProps {
  selectedSubmission: Submission | null;
  refreshSubmissions: () => Promise<void>;
  settings: AgencySettings;
  toast: any;
  setIsSending: (value: boolean) => void;
}

export function useSendResponse({
  selectedSubmission,
  refreshSubmissions,
  settings,
  toast,
  setIsSending
}: UseSendResponseProps) {
  
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
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ 
          response: responseText,
          response_date: response_date,
          is_read: true
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      // After saving the response, refresh the submission data
      await refreshSubmissions();

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

  return { handleSendResponse };
}
