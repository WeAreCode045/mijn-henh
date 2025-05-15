
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );

    // Get request body
    const { email, password, userData, accountType, role } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Creating user with email: ${email}, type: ${accountType}, role: ${role}`);

    // Create user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const userId = authData.user.id;
    
    // Create account record
    const { data: accountData, error: accountError } = await supabaseClient
      .from('accounts')
      .insert({
        user_id: userId,
        type: accountType || 'employee',
        role: role || 'agent',
        email: email,
        display_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || undefined
      })
      .select('id')
      .single();

    if (accountError) {
      console.error('Error creating account:', accountError);
      // Roll back the user creation since account creation failed
      await supabaseClient.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: `Error creating account: ${accountError.message}` }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const accountId = accountData.id;

    // Create profile based on account type
    if (accountType === 'employee') {
      const { error: profileError } = await supabaseClient
        .from('employer_profiles')
        .insert({
          id: accountId,
          email: email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          role: role || 'agent',
          whatsapp_number: userData.whatsapp_number || ''
        });

      if (profileError) {
        console.error('Error creating employer profile:', profileError);
        return new Response(
          JSON.stringify({ error: `Error creating profile: ${profileError.message}` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    } else if (accountType === 'participant') {
      const { error: profileError } = await supabaseClient
        .from('participants_profile')
        .insert({
          id: accountId,
          email: email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          role: role || 'buyer',
          whatsapp_number: userData.whatsapp_number || ''
        });

      if (profileError) {
        console.error('Error creating participant profile:', profileError);
        return new Response(
          JSON.stringify({ error: `Error creating profile: ${profileError.message}` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    
    console.log('User, account and profile created successfully');

    return new Response(
      JSON.stringify({
        user: authData.user,
        account: {
          id: accountId,
          type: accountType || 'employee',
          role: role || 'agent'
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: `An unexpected error occurred: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
