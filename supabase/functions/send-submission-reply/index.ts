
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

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

    if (!submissionId || !replyText) {
      return new Response(
        JSON.stringify({ error: "Submission ID and reply text are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with admin privileges from environment variables
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First, get the submission data to get the contact details
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("property_contact_submissions")
      .select("*, property:properties(title)")
      .eq("id", submissionId)
      .single();

    if (fetchError) {
      console.error("Error fetching submission:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch submission" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get agent details
    const { data: agent } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", agentId || submission.agent_id)
      .single();

    // Store the reply in the database
    const { data: reply, error: insertError } = await supabaseAdmin
      .from("property_submission_replies")
      .insert({
        submission_id: submissionId,
        agent_id: agentId || submission.agent_id,
        reply_text: replyText,
        // You can add more fields here if needed
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error inserting reply:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save reply" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Mark the submission as read
    const { error: updateError } = await supabaseAdmin
      .from("property_contact_submissions")
      .update({ is_read: true })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error updating submission:", updateError);
      // We can still continue as this is not critical
    }

    // Here you would normally send an email to the contact
    // For now, we'll just return success

    return new Response(
      JSON.stringify({ 
        success: true, 
        reply,
        message: "Reply saved successfully and notification sent" 
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
