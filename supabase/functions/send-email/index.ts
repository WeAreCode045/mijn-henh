
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
    const { type, participantId } = await req.json();

    if (type === 'resend_participant_invite') {
      const { data: participant, error: participantError } = await supabase
        .from('property_participants')
        .select('*, user:profiles(*), property:properties(title)')
        .eq('id', participantId)
        .single();

      if (participantError) throw participantError;
      if (!participant || !participant.user?.email) {
        throw new Error('Participant or email not found');
      }

      const { data: emailResult } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: participant.user.email,
        subject: `Reminder: Join ${participant.property.title} as a ${participant.role}`,
        html: `
          <h1>You have been invited to join a property</h1>
          <p>You have been invited to join ${participant.property.title} as a ${participant.role}.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${Deno.env.get('SITE_URL')}/properties/${participant.property_id}">Accept Invitation</a>
        `,
      });

      return new Response(JSON.stringify(emailResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid request type');
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
