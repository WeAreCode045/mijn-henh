
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Resend with the API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    const resend = new Resend(resendApiKey);

    const { type, participantId, to, subject, html, text, from, fromName } = await req.json();

    // Handle participant invitation resend
    if (type === 'resend_participant_invite') {
      // Create Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials missing from environment variables");
      }
      
      const supabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey,
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      );
      
      // Fetch participant data
      const { data: participant, error: participantError } = await supabaseClient
        .from('property_participants')
        .select('*, user:profiles(*), property:properties(title, agent_id)')
        .eq('id', participantId)
        .single();

      if (participantError) throw participantError;
      if (!participant || !participant.user?.email) {
        throw new Error('Participant or email not found');
      }

      // Get agency settings directly
      const { data: agencySettings, error: agencyError } = await supabaseClient
        .from('agency_settings')
        .select('resend_from_email, resend_from_name')
        .single();
        
      if (agencyError) throw agencyError;

      // Use agency settings for the from address if available
      const fromEmail = agencySettings?.resend_from_email || 'onboarding@resend.dev';
      const fromName = agencySettings?.resend_from_name || 'Property Portal';

      const { error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: participant.user.email,
        subject: `Reminder: Join ${participant.property.title} as a ${participant.role}`,
        html: `
          <h1>You have been invited to join a property</h1>
          <p>You have been invited to join ${participant.property.title} as a ${participant.role}.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${Deno.env.get('SITE_URL') || 'https://app.hausenhuis.com'}/participant">Accept Invitation</a>
        `,
      });

      if (error) throw error;
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle general email sending
    if (to && (html || text) && subject) {
      // Get agency settings directly without using current user
      let fromEmail = from || 'onboarding@resend.dev';
      let displayName = fromName || 'Property Portal';

      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
        
        if (supabaseUrl && supabaseAnonKey) {
          const supabaseClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
          );
          
          // Try to get agency settings directly
          const { data: agencySettings } = await supabaseClient
            .from('agency_settings')
            .select('resend_from_email, resend_from_name')
            .single();
            
          if (agencySettings?.resend_from_email) {
            fromEmail = agencySettings.resend_from_email;
            displayName = agencySettings.resend_from_name || displayName;
          }
        }
      } catch (err) {
        // If we can't get the agency settings, just use the provided from/fromName
        console.log("Error getting agency settings:", err);
      }

      const { data, error } = await resend.emails.send({
        from: `${displayName} <${fromEmail}>`,
        to: typeof to === 'string' ? [to] : to,
        subject,
        html,
        text
      });

      if (error) throw error;
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid request data');
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
