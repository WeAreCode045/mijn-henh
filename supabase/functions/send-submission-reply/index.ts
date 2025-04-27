
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, replyText, propertyId, recipientEmail } = await req.json();
    
    // Initialize Supabase client with the authorization header from the request
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    // Get the submission details if recipientEmail is not provided
    let emailTo = recipientEmail;
    let submissionData;
    
    if (!emailTo) {
      const { data: submission, error: submissionError } = await supabaseClient
        .from("property_contact_submissions")
        .select("*")
        .eq("id", submissionId)
        .single();

      if (submissionError) {
        throw new Error(`Failed to get submission: ${submissionError.message}`);
      }
      
      submissionData = submission;
      emailTo = submission.email;
    }

    // Get property details
    const { data: property, error: propertyError } = await supabaseClient
      .from("properties")
      .select("title, agency_id")
      .eq("id", propertyId)
      .single();

    if (propertyError) {
      throw new Error(`Failed to get property: ${propertyError.message}`);
    }

    // Get agency settings for email configuration
    const { data: agencySettings, error: agencyError } = await supabaseClient
      .from("agency_settings")
      .select("*")
      .eq("id", property.agency_id)
      .single();

    if (agencyError) {
      throw new Error(`Failed to get agency settings: ${agencyError.message}`);
    }

    // Get sender info (current user)
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      throw new Error(`Failed to get user info: ${userError.message}`);
    }

    // Get profile info
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (profileError) {
      throw new Error(`Failed to get profile: ${profileError.message}`);
    }

    // Determine from details
    const fromName = agencySettings.resend_from_name || agencySettings.smtp_from_name || profile.full_name || 'Property Portal';
    const fromEmail = agencySettings.resend_from_email || agencySettings.smtp_from_email || 'onboarding@resend.dev';

    const { error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: emailTo,
      subject: `Re: ${property.title}`,
      html: `
        <div>
          <h3>Response to your inquiry about ${property.title}</h3>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #ccc; color: #333;">
            ${replyText.replace(/\n/g, '<br>')}
          </div>
          <p>Kind regards,<br>${profile.full_name || fromName}</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message || JSON.stringify(emailError)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
