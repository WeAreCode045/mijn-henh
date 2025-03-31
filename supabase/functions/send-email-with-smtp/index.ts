
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
  mailjetApiKey?: string;
  mailjetApiSecret?: string;
  mailjetFromEmail?: string;
  mailjetFromName?: string;
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

async function sendWithMailjet(settings: Settings, message: EmailMessage) {
  if (!settings.mailjetApiKey || !settings.mailjetApiSecret) {
    throw new Error('Mailjet API key or secret missing');
  }

  const fromEmail = message.from || settings.mailjetFromEmail;
  const fromName = message.fromName || settings.mailjetFromName;

  if (!fromEmail) {
    throw new Error('From email is required for Mailjet');
  }

  try {
    // Create recipient array
    let recipients = [];
    if (Array.isArray(message.to)) {
      recipients = message.to.map(email => ({ Email: email }));
    } else {
      recipients = [{ Email: message.to }];
    }

    // Create CC recipients if they exist
    let ccRecipients = [];
    if (message.cc) {
      if (Array.isArray(message.cc)) {
        ccRecipients = message.cc.map(email => ({ Email: email }));
      } else {
        ccRecipients = [{ Email: message.cc }];
      }
    }

    const url = "https://api.mailjet.com/v3.1/send";
    const auth = btoa(`${settings.mailjetApiKey}:${settings.mailjetApiSecret}`);

    const payload = {
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName || fromEmail
          },
          To: recipients,
          Cc: ccRecipients.length > 0 ? ccRecipients : undefined,
          Subject: message.subject,
          TextPart: message.text || "",
          HTMLPart: message.html || message.text || ""
        }
      ]
    };

    console.log('Sending email via Mailjet:', {
      from: fromEmail,
      to: message.to,
      subject: message.subject
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mailjet API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Mailjet response:', data);
    return data;
  } catch (error) {
    console.error('Mailjet error:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    
    // Ensure message and settings are defined
    if (!requestData || !requestData.message || !requestData.settings) {
      throw new Error('Invalid request: message or settings missing');
    }
    
    const { message, settings } = requestData;

    // Validate that message.to exists
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
      mailjet: !!settings.mailjetApiKey
    });

    let result;
    let provider;

    // First try Mailjet if configured
    if (settings.mailjetApiKey && settings.mailjetApiSecret) {
      try {
        console.log('Attempting to send via Mailjet');
        result = await sendWithMailjet(settings, message);
        provider = 'mailjet';
      } catch (mailjetError) {
        console.error('Mailjet error:', mailjetError);
        
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
          throw new Error(`Mailjet error: ${mailjetError.message}`);
        }
      }
    } 
    // If no Mailjet, try SMTP
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
