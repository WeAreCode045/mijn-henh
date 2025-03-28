
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, replyText } = await req.json();

    if (!submissionId || !replyText) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required data. Required: submissionId, replyText" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    
    // Extract the JWT token from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user from the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const userId = user.id;

    // 1. Get the submission details
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
        agent:profiles(id, full_name, email, phone, agent_photo)
      `)
      .eq("id", submissionId)
      .single();

    if (submissionError) {
      throw new Error(`Error fetching submission: ${submissionError.message}`);
    }

    if (!submission) {
      throw new Error(`Submission with ID ${submissionId} not found`);
    }

    // 2. Get the user who is replying (could be an agent or admin)
    const { data: replyingUser, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, agent_photo")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!replyingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // 3. Get agency settings for email configuration
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("agency_settings")
      .select("*")
      .single();

    if (settingsError) {
      throw new Error(`Error fetching agency settings: ${settingsError.message}`);
    }

    if (!settings) {
      throw new Error("Agency settings not found");
    }

    // 4. Prepare email content
    const emailContent = {
      to: submission.email,
      subject: `Re: Your inquiry about ${submission.property?.title || 'our property'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${submission.name},</h2>
          <p>Thank you for your interest in ${submission.property?.title || 'our property'} at ${submission.property?.address || 'our location'}.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #3b82f6;">
            <p style="white-space: pre-line;">${replyText}</p>
          </div>
          <div style="margin-top: 30px;">
            <div style="display: flex; align-items: center;">
              ${replyingUser.agent_photo ? `<img src="${replyingUser.agent_photo}" alt="${replyingUser.full_name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;">` : ''}
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
    };
    
    // 5. Save the reply to the database
    const { error: replyError } = await supabaseAdmin
      .from("property_submission_replies")
      .insert({
        submission_id: submissionId,
        user_id: userId, // Use the authenticated user's ID
        reply_text: replyText
      });
    
    if (replyError) {
      throw new Error(`Error saving reply: ${replyError.message}`);
    }

    // 6. Call email sending function if it's available
    let emailResult = null;
    try {
      if (settings.smtp_host && settings.smtp_username && settings.smtp_password) {
        const { data: emailData, error: emailError } = await supabaseAdmin.functions.invoke('send-email-with-smtp', {
          body: emailContent
        });
        
        if (emailError) {
          console.error("Error sending email:", emailError);
          // Continue - we still saved the reply to the database
        } else {
          emailResult = emailData;
        }
      }
    } catch (emailError) {
      console.error("Error invoking email function:", emailError);
      // Continue - we still saved the reply to the database
    }

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
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
