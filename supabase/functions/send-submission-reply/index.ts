
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create Supabase client
const createSupabaseClient = (token?: string) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  
  const options = token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : undefined;
  
  return createClient(supabaseUrl, supabaseKey, options);
};

// Authenticate user from request
const authenticateUser = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    throw new Error("No authorization header");
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabaseAdmin = createSupabaseClient();
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    throw new Error("Unauthorized");
  }
  
  return { user, token };
};

// Validate request body
const validateRequestBody = (body: any) => {
  const { submissionId, replyText, recipientEmail } = body;
  
  if (!submissionId || !replyText) {
    throw new Error("Missing required data. Required: submissionId, replyText");
  }
  
  return { submissionId, replyText, recipientEmail };
};

// Fetch submission details
const fetchSubmissionDetails = async (supabaseAdmin: any, submissionId: string) => {
  const { data: submission, error: submissionError } = await supabaseAdmin
    .from("property_contact_submissions")
    .select(`
      id, 
      name, 
      email, 
      phone, 
      message, 
      property_id,
      property:properties(title, address),
      agent:profiles(id, full_name, email, phone, avatar_url)
    `)
    .eq("id", submissionId)
    .single();

  if (submissionError) {
    throw new Error(`Error fetching submission: ${submissionError.message}`);
  }

  if (!submission) {
    throw new Error(`Submission with ID ${submissionId} not found`);
  }
  
  return submission;
};

// Fetch user details
const fetchUserDetails = async (supabaseAdmin: any, userId: string) => {
  const { data: user, error: userError } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url")
    .eq("id", userId)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  return user;
};

// Fetch agency settings
const fetchAgencySettings = async (supabaseAdmin: any) => {
  const { data: settings, error: settingsError } = await supabaseAdmin
    .from("agency_settings")
    .select("*")
    .single();

  if (settingsError && settingsError.code !== 'PGRST116') {
    throw new Error(`Error fetching agency settings: ${settingsError.message}`);
  }

  return settings || {};
};

// Prepare email content
const prepareEmailContent = (submission: any, replyText: string, replyingUser: any, recipientEmail?: string) => {
  return {
    to: recipientEmail || submission.email,
    subject: `Re: Your inquiry about ${submission.property?.title || 'our property'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${submission.name},</h2>
        <p>Thank you for your interest in ${submission.property?.title || 'our property'} at ${submission.property?.address || 'our location'}.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #3b82f6;">
          <p style="white-space: pre-line;">${replyText}</p>
        </div>
        <div style="margin-top: 30px;">
          <div>
            ${replyingUser.avatar_url ? `<img src="${replyingUser.avatar_url}" alt="${replyingUser.full_name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;">` : ''}
            <div>
              <p style="margin: 0; font-weight: bold;">${replyingUser.full_name}</p>
              <p style="margin: 5px 0;">${replyingUser.email}</p>
              ${replyingUser.phone ? `<p style="margin: 0;">${replyingUser.phone}</p>` : ''}
            </div>
          </div>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
        <p style="color: #666; font-size: 12px;">
          This is in response to your inquiry sent on ${new Date(submission.created_at).toLocaleDateString()}.
        </p>
      </div>
    `,
    text: `Hello ${submission.name},\n\nThank you for your interest in ${submission.property?.title || 'our property'} at ${submission.property?.address || 'our location'}.\n\n${replyText}\n\nBest regards,\n${replyingUser.full_name}\n${replyingUser.email}\n${replyingUser.phone || ''}`
  };
};

// Save reply to database
const saveReplyToDatabase = async (supabaseAdmin: any, submissionId: string, userId: string, replyText: string) => {
  const { error: replyError } = await supabaseAdmin
    .from("property_submission_replies")
    .insert({
      submission_id: submissionId,
      agent_id: userId,
      reply_text: replyText
    });
  
  if (replyError) {
    throw new Error(`Error saving reply: ${replyError.message}`);
  }
};

// Send email with Mailjet
const sendEmailWithMailjet = async (supabaseAdmin: any, settings: any, emailContent: any) => {
  if (!settings.mailjet_api_key || !settings.mailjet_api_secret) {
    // Try SMTP if Mailjet is not configured
    return await sendEmailWithSMTP(supabaseAdmin, settings, emailContent);
  }
  
  try {
    console.log("Sending email with Mailjet, content:", JSON.stringify({
      to: emailContent.to,
      subject: emailContent.subject,
      hasHtml: !!emailContent.html,
      hasText: !!emailContent.text
    }));
    
    const { data: emailData, error: emailError } = await supabaseAdmin.functions.invoke(
      'send-email-with-smtp', 
      { 
        body: {
          to: emailContent.to,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        }
      }
    );
    
    if (emailError) {
      console.error("Error sending email:", emailError);
      return null;
    }
    
    return emailData;
  } catch (error) {
    console.error("Error invoking email function:", error);
    return null;
  }
};

// Send email with SMTP (fallback)
const sendEmailWithSMTP = async (supabaseAdmin: any, settings: any, emailContent: any) => {
  if (!settings.smtp_host || !settings.smtp_username || !settings.smtp_password) {
    console.log("Email sending not configured (no Mailjet or SMTP settings)");
    return null;
  }
  
  try {
    console.log("Sending email with SMTP, content:", JSON.stringify({
      to: emailContent.to,
      subject: emailContent.subject,
      hasHtml: !!emailContent.html,
      hasText: !!emailContent.text
    }));
    
    const { data: emailData, error: emailError } = await supabaseAdmin.functions.invoke(
      'send-email-with-smtp', 
      { 
        body: {
          to: emailContent.to,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        }
      }
    );
    
    if (emailError) {
      console.error("Error sending email:", emailError);
      return null;
    }
    
    return emailData;
  } catch (error) {
    console.error("Error invoking email function:", error);
    return null;
  }
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Validate request body
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));
    const { submissionId, replyText, recipientEmail } = validateRequestBody(body);

    // 2. Authenticate user
    const { user, token } = await authenticateUser(req);
    const userId = user.id;
    console.log("Authenticated user ID:", userId);
    
    // 3. Create Supabase client
    const supabaseAdmin = createSupabaseClient();
    
    // 4. Fetch necessary data
    const submission = await fetchSubmissionDetails(supabaseAdmin, submissionId);
    const replyingUser = await fetchUserDetails(supabaseAdmin, userId);
    const settings = await fetchAgencySettings(supabaseAdmin);
    console.log("Fetched all required data");
    
    // 5. Save the reply
    await saveReplyToDatabase(supabaseAdmin, submissionId, userId, replyText);
    console.log("Saved reply to database");
    
    // 6. Send email with Mailjet if configured, or fall back to SMTP
    const emailContent = prepareEmailContent(submission, replyText, replyingUser, recipientEmail);
    const emailResult = await sendEmailWithMailjet(supabaseAdmin, settings, emailContent);
    console.log("Email send result:", emailResult ? "Success" : "Not sent");

    // 7. Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reply saved successfully",
        emailSent: !!emailResult
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-submission-reply function:", error);
    
    // Handle specific errors
    if (error.message === "No authorization header" || error.message === "Unauthorized") {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (error.message.includes("Missing required data")) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // General error handling
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
