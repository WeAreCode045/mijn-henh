
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle POST request
    if (req.method === 'POST') {
      const requestData: CreateUserRequest = await req.json();
      const { email, password, firstName, lastName } = requestData;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Create user in Auth
      const { data: authUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Auto-confirm email
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!authUser?.user?.id) {
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const userId = authUser.user.id;
      const displayName = `${firstName || ''} ${lastName || ''}`.trim();

      // Create account
      const { data: accountData, error: accountError } = await supabaseClient
        .from('accounts')
        .insert({
          user_id: userId,
          email,
          type: 'participant',
          status: 'pending',
          display_name: displayName || email.split('@')[0]
        })
        .select('id')
        .single();

      if (accountError) {
        console.error('Error creating account:', accountError);
        return new Response(
          JSON.stringify({ error: accountError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Create participant profile
      await supabaseClient
        .from('participants_profile')
        .insert({
          id: accountData.id,
          email,
          first_name: firstName || '',
          last_name: lastName || ''
        });

      return new Response(
        JSON.stringify({
          success: true,
          userId,
          accountId: accountData.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
