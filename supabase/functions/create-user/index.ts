
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

console.log("Create User Function Starting");

// This function creates a new authenticated user and sets up the relevant profiles
serve(async (req) => {
  try {
    // Parse the request body
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({
        error: "Email and password are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Creating auth user");
    
    // Create the user in auth.users
    const { data: authUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      console.error("Failed to create auth user:", createUserError);
      return new Response(JSON.stringify({
        error: `Failed to create user: ${createUserError.message}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Auth user created", authUser);

    const userId = authUser.user.id;
    
    // Let trigger handle the account and profile creation
    
    return new Response(JSON.stringify({
      message: "User created successfully",
      userId: userId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: `Internal server error: ${error.message}`
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
