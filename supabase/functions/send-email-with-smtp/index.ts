
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createTransport } from "https://esm.sh/nodemailer@6.9.1"
import * as Mailjet from "https://esm.sh/node-mailjet@3.3.1"

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

async function sendWithMailjet(settings: Settings, message: EmailMessage) {
  if (!settings.mailjetApiKey || !settings.mailjetApiSecret) {
    throw new Error('Mailjet API key or secret missing');
  }

  const fromEmail = message.from || settings.mailjetFromEmail;
  const fromName = message.fromName || settings.mailjetFromName;

  if (!fromEmail) {
    throw new Error('From email is required for Mailjet');
  }

  const mailjet = Mailjet.connect(
    settings.mailjetApiKey,
    settings.mailjetApiSecret
  );

  // Prepare recipients
  let recipients = [];
  if (Array.isArray(message.to)) {
    recipients = message.to.map(email => ({ Email: email }));
  } else {
    recipients = [{ Email: message.to }];
  }

  // Prepare CC recipients if they exist
  let ccRecipients = [];
  if (message.cc) {
    if (Array.isArray(message.cc)) {
      ccRecipients = message.cc.map(email => ({ Email: email }));
    } else {
      ccRecipients = [{ Email: message.cc }];
    }
  }

  const request = mailjet.post("send", { version: "v3.1" }).request({
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
  });

  const response = await request;
  console.log('Mailjet response:', response);
  return response;
}

async function sendWithSMTP(settings: Settings, message: EmailMessage) {
  if (!settings.smtpHost || !settings.smtpPort || !settings.smtpUsername || !settings.smtpPassword) {
    throw new Error('SMTP credentials missing');
  }

  const fromEmail = message.from || settings.smtpFromEmail;
  const fromName = message.fromName || settings.smtpFromName;

  if (!fromEmail) {
    throw new Error('From email is required for SMTP');
  }

  // Create SMTP transporter
  const transporter = createTransport({
    host: settings.smtpHost,
    port: parseInt(settings.smtpPort),
    secure: settings.smtpSecure || false,
    auth: {
      user: settings.smtpUsername,
      pass: settings.smtpPassword,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: fromName ? `"${fromName}" <${fromEmail}>` : fromEmail,
    to: message.to,
    cc: message.cc,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  console.log('SMTP Message sent: %s', info.messageId);
  return info;
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
    const { message, settings } = requestData;

    console.log('Received email request:', {
      to: message.to,
      subject: message.subject
    });
    console.log('Available settings:', {
      smtp: !!settings.smtpHost,
      mailjet: !!settings.mailjetApiKey
    });

    // First try Mailjet if configured
    if (settings.mailjetApiKey && settings.mailjetApiSecret) {
      try {
        console.log('Attempting to send via Mailjet');
        const result = await sendWithMailjet(settings, message);
        return new Response(
          JSON.stringify({ success: true, provider: 'mailjet', result }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (mailjetError) {
        console.error('Mailjet error:', mailjetError);
        
        // If we have SMTP configured as fallback, try that
        if (settings.smtpHost) {
          console.log('Falling back to SMTP');
          try {
            const result = await sendWithSMTP(settings, message);
            return new Response(
              JSON.stringify({ success: true, provider: 'smtp', result }),
              {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          } catch (smtpError) {
            console.error('SMTP error:', smtpError);
            throw smtpError; // Re-throw to be caught by outer handler
          }
        } else {
          throw mailjetError; // Re-throw if no fallback
        }
      }
    } 
    // If no Mailjet, try SMTP
    else if (settings.smtpHost) {
      console.log('Attempting to send via SMTP');
      const result = await sendWithSMTP(settings, message);
      return new Response(
        JSON.stringify({ success: true, provider: 'smtp', result }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('No email service configured');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
