
import { supabase } from "@/integrations/supabase/client";

interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  fromName
}: SendEmailArgs): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, text, from, fromName }
    });

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
}
