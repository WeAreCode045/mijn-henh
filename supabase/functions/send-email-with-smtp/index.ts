import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
}

interface Settings {
  smtpHost?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  smtpSecure?: boolean;
  resendApiKey?: string;
  resendFromEmail?: string;
  resendFromName?: string;
}

async function sendWithResend(settings: Settings, message: EmailMessage) {
  if (!settings.resendApiKey) {
    throw new Error('Resend API key missing');
  }

  const fromEmail = message.from || settings.resendFromEmail;
  const fromName = message.fromName || settings.resendFromName;

  if (!fromEmail) {
    throw new Error('From email is required for Resend');
  }

  const resend = new Resend(settings.resendApiKey);

  try {
    console.log('Sending email via Resend:', {
      from: fromEmail,
      to: message.to,
      subject: message.subject
    });

    const emailResult = await resend.emails.send({
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      to: Array.isArray(message.to) ? message.to : [message.to],
      cc: message.cc,
      subject: message.subject,
      html: message.html || message.text || '',
      text: message.text
    });

    console.log('Email sent successfully via Resend');
    return emailResult;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}

async function sendWithSmtp(settings: Settings, message: EmailMessage) {
  if (!settings.smtpHost || !settings.smtpUsername || !settings.smtpPassword) {
    throw new Error('SMTP credentials missing');
  }

  const fromEmail = message.from || settings.smtpFromEmail;
  const fromName = message.fromName || settings.smtpFromName;

  if (!fromEmail) {
    throw new Error('From email is required for SMTP');
  }

  try {
    console.log('Creating SMTP client with:', {
      hostname: settings.smtpHost,
      port: parseInt(settings.smtpPort || '587'),
      username: settings.smtpUsername
    });

    const client = new SmtpClient();

    await client.connect({
      hostname: settings.smtpHost,
      port: parseInt(settings.smtpPort || '587'),
      username: settings.smtpUsername,
      password: settings.smtpPassword,
      tls: settings.smtpSecure === true
    });

    console.log('SMTP client connected');

    // Prepare recipients
    let toAddresses: string[] = [];
    if (Array.isArray(message.to)) {
      toAddresses = message.to;
    } else if (typeof message.to === 'string') {
      toAddresses = [message.to];
    }

    // Format sender with name if provided
    const formattedFrom = fromName 
      ? `${fromName} <${fromEmail}>`
      : fromEmail;

    console.log('Sending email via SMTP:', {
      from: formattedFrom,
      to: toAddresses,
      subject: message.subject
    });

    const emailResult = await client.send({
      from: formattedFrom,
      to: toAddresses,
      cc: message.cc,
      subject: message.subject,
      content: message.html || message.text || '',
      html: !!message.html
    });

    await client.close();
    console.log('Email sent successfully');
    return emailResult;
  } catch (error) {
    console.error('SMTP error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    if (!requestData || !requestData.message || !requestData.settings) {
      throw new Error('Invalid request: message or settings missing');
    }
    
    const { message, settings } = requestData;

    if (!message.to) {
      throw new Error('Recipient (to) is required');
    }

    console.log('Received email request:', {
      to: message.to,
      subject: message.subject,
      hasHtml: !!message.html,
      hasText: !!message.text
    });

    console.log('Available settings:', {
      smtp: !!settings.smtpHost,
      resend: !!settings.resendApiKey
    });

    let result;
    let provider;

    // First try Resend if configured
    if (settings.resendApiKey) {
      try {
        console.log('Attempting to send via Resend');
        result = await sendWithResend(settings, message);
        provider = 'resend';
      } catch (resendError) {
        console.error('Resend error:', resendError);
        
        // If we have SMTP configured as fallback, try that
        if (settings.smtpHost) {
          console.log('Falling back to SMTP');
          try {
            result = await sendWithSmtp(settings, message);
            provider = 'smtp';
          } catch (smtpError) {
            console.error('SMTP error:', smtpError);
            throw new Error(`Email sending failed: ${smtpError.message}`);
          }
        } else {
          throw new Error(`Resend error: ${resendError.message}`);
        }
      }
    } 
    // If no Resend, try SMTP
    else if (settings.smtpHost) {
      console.log('Attempting to send via SMTP');
      try {
        result = await sendWithSmtp(settings, message);
        provider = 'smtp';
      } catch (smtpError) {
        console.error('SMTP error:', smtpError);
        throw new Error(`SMTP error: ${smtpError.message}`);
      }
    } else {
      throw new Error('No email service configured');
    }

    return new Response(
      JSON.stringify({ success: true, provider, result }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
