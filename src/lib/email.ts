
import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
}

export async function sendEmail({ to, subject, html, from, fromName }: SendEmailParams) {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        to,
        subject,
        html,
        from,
        fromName
      }
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
