
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

      const { error } = await resend.emails.send({
        from: from || fromName 
          ? `${fromName || 'Property Portal'} <${from || 'onboarding@resend.dev'}>`
          : 'Property Portal <onboarding@resend.dev>',
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
      const { data, error } = await resend.emails.send({
        from: from || fromName 
          ? `${fromName || 'Property Portal'} <${from || 'onboarding@resend.dev'}>`
          : 'Property Portal <onboarding@resend.dev>',
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

// Helper to create Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
