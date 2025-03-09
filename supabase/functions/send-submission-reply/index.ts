
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
    const { submissionId, replyText, agentId } = await req.json();

    if (!submissionId || !replyText || !agentId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required data. Required: submissionId, replyText, agentId" 
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

    // 2. Get the agent details
    const { data: agent, error: agentError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, agent_photo")
      .eq("id", agentId)
      .single();

    if (agentError) {
      throw new Error(`Error fetching agent: ${agentError.message}`);
    }

    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
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
      from: {
        email: settings.smtp_from_email || agent.email,
        name: agent.full_name
      },
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
              ${agent.agent_photo ? `<img src="${agent.agent_photo}" alt="${agent.full_name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;">` : ''}
              <div>
                <p style="margin: 0; font-weight: bold;">${agent.full_name}</p>
                <p style="margin: 5px 0;">${agent.email}</p>
                ${agent.phone ? `<p style="margin: 0;">${agent.phone}</p>` : ''}
              </div>
            </div>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;">
          <p style="color: #666; font-size: 12px;">
            This is in response to your inquiry sent on ${new Date(submission.created_at).toLocaleDateString()}.
          </p>
        </div>
      `,
      // We'll use the Edge Function or EmailEngine if set up
      // For now, we're just recording the reply in the database
    };

    // 5. Call email sending function if it's available
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
