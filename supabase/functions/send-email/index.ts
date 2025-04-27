
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, participantId, to, subject, html, text, from, fromName } = await req.json();

    // Handle participant invitation resend
    if (type === 'resend_participant_invite') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_ANON_KEY') || '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      );
      
      const { data: participant, error: participantError } = await supabaseClient
        .from('property_participants')
        .select('*, user:profiles(*), property:properties(title)')
        .eq('id', participantId)
        .single();

      if (participantError) throw participantError;
      if (!participant || !participant.user?.email) {
        throw new Error('Participant or email not found');
      }

      // Get domain settings from agency
      const { data: property, error: propertyError } = await supabaseClient
        .from('properties')
        .select('agency_id')
        .eq('id', participant.property_id)
        .single();
        
      if (propertyError) throw propertyError;
      
      const { data: agencySettings, error: agencyError } = await supabaseClient
        .from('agency_settings')
        .select('resend_from_email, resend_from_name')
        .eq('id', property.agency_id)
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
      // Get domain settings if possible
      let fromEmail = from || 'onboarding@resend.dev';
      let displayName = fromName || 'Property Portal';

      // Try to get authorization header and use it if available
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        try {
          const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') || '',
            Deno.env.get('SUPABASE_ANON_KEY') || '',
            { global: { headers: { Authorization: authHeader } } }
          );
          
          // Try to get the user's agency settings
          const { data: userAgency } = await supabaseClient.auth.getUser();
          
          if (userAgency?.user?.id) {
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('agency_id')
              .eq('id', userAgency.user.id)
              .single();
              
            if (profile?.agency_id) {
              const { data: agencySettings } = await supabaseClient
                .from('agency_settings')
                .select('resend_from_email, resend_from_name')
                .eq('id', profile.agency_id)
                .single();
                
              if (agencySettings?.resend_from_email) {
                fromEmail = agencySettings.resend_from_email;
                displayName = agencySettings.resend_from_name || displayName;
              }
            }
          }
        } catch (err) {
          // If we can't get the user's agency settings, just use the provided from/fromName
          console.log("Error getting agency settings:", err);
        }
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
