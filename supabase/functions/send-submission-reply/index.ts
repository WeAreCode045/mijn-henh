
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  property_id: string;
}

interface Reply {
  id: string;
  submission_id: string;
  reply_text: string;
  user_id: string;
  agent_id?: string;
}

interface AgentProfile {
  id: string;
  email: string;
  full_name: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
}

interface EmailSettings {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    const { replyId, recipientEmail } = requestBody;
    console.log('Processing reply:', replyId);
    console.log('Custom recipient email:', recipientEmail);

    if (!replyId) {
      return new Response(
        JSON.stringify({ error: `Reply ID is required` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the reply details
    const { data: reply, error: replyError } = await supabaseClient
      .from('property_submission_replies')
      .select('*')
      .eq('id', replyId)
      .single();

    if (replyError || !reply) {
      console.error('Error fetching reply:', replyError);
      return new Response(
        JSON.stringify({ error: `Reply not found: ${replyError?.message}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the original submission
    const { data: submission, error: submissionError } = await supabaseClient
      .from('property_contact_submissions')
      .select('*')
      .eq('id', reply.submission_id)
      .single();

    if (submissionError || !submission) {
      console.error('Error fetching submission:', submissionError);
      return new Response(
        JSON.stringify({ error: `Submission not found: ${submissionError?.message}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get property details
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('title, id')
      .eq('id', submission.property_id)
      .single();

    if (propertyError) {
      console.error('Error fetching property:', propertyError);
      // Continue without property info
    }

    // Get agent profile information
    const { data: agentProfile, error: agentError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', reply.agent_id || user.id)
      .single();

    if (agentError) {
      console.error('Error fetching agent profile:', agentError);
      // Continue without agent info
    }

    // Fetch agency settings for email configuration
    const { data: agencySettings, error: settingsError } = await supabaseClient
      .from('agency_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Error fetching agency settings:', settingsError);
      return new Response(
        JSON.stringify({ error: `Failed to get email settings: ${settingsError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email settings
    const emailSettings: EmailSettings = {
      smtpHost: agencySettings.smtp_host,
      smtpPort: agencySettings.smtp_port,
      smtpUsername: agencySettings.smtp_username,
      smtpPassword: agencySettings.smtp_password,
      smtpFromEmail: agencySettings.smtp_from_email,
      smtpFromName: agencySettings.smtp_from_name,
      smtpSecure: agencySettings.smtp_secure,
      mailjetApiKey: agencySettings.mailjet_api_key,
      mailjetApiSecret: agencySettings.mailjet_api_secret,
      mailjetFromEmail: agencySettings.mailjet_from_email,
      mailjetFromName: agencySettings.mailjet_from_name,
    };

    // Determine the from email to use (prefer Mailjet if available)
    const fromEmail = agencySettings.mailjet_from_email || 
                      agencySettings.smtp_from_email || 
                      agentProfile?.email || 
                      'noreply@example.com';
                      
    const fromName = agencySettings.mailjet_from_name || 
                    agencySettings.smtp_from_name || 
                    agentProfile?.full_name || 
                    'Property Agent';

    const propertyTitle = property?.title || 'Property';

    // Use custom recipient email if provided, otherwise fallback to submission email
    const toEmail = recipientEmail || submission.email;

    // Make sure we have recipient email
    if (!toEmail) {
      throw new Error("Recipient email is missing");
    }

    console.log(`Sending email to: ${toEmail} (${recipientEmail ? 'custom' : 'original submission'})`);

    // Prepare the email content
    const emailData: EmailData = {
      to: toEmail,
      subject: `RE: Your inquiry about ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${submission.name},</p>
          <p>Thank you for your inquiry about our property.</p>
          <p>${reply.reply_text}</p>
          <p>Best regards,</p>
          <p>${agentProfile?.full_name || 'The Property Team'}</p>
        </div>
      `,
      from: fromEmail,
      fromName: fromName
    };

    console.log('Sending email with:', { 
      to: emailData.to,
      subject: emailData.subject,
      from: fromEmail
    });

    // Call the send-email-with-smtp edge function with the explicitly structured message and settings
    const emailResponse = await supabaseClient.functions.invoke('send-email-with-smtp', {
      body: JSON.stringify({
        message: emailData,
        settings: emailSettings
      }),
    });

    if (emailResponse.error) {
      console.error('Email sending failed:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: `Failed to send email: ${emailResponse.error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', emailResponse.data);

    // Update the submission as read
    const { error: updateError } = await supabaseClient
      .from('property_contact_submissions')
      .update({ is_read: true })
      .eq('id', submission.id);

    if (updateError) {
      console.error('Error marking submission as read:', updateError);
      // Continue even if this fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Reply sent successfully',
        emailDetails: emailResponse.data
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
