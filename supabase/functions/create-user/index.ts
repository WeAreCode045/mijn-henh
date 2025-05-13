
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface RequestBody {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Parse request body
    const { email, password, firstName, lastName }: RequestBody = await req.json()

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create user with admin privileges
    const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm the email
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${authError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user: No user data returned' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const userId = userData.user.id

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: 'User created successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: String(err)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
