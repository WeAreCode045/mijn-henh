import type { Request, Response } from 'express';
// Using Express types since Next.js App Router doesn't use NextApiRequest/NextApiResponse
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(
  req: Request,
  res: Response
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('participants_profile')
      .select('id, email')
      .eq('email', email)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return res.status(500).json({ error: 'Failed to check if user exists' });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user with admin privileges
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm the email
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return res.status(500).json({ error: `Failed to create user: ${createError.message}` });
    }

    if (!authUser || !authUser.user || !authUser.user.id) {
      return res.status(500).json({ error: 'Failed to create user: No user ID returned' });
    }

    const userId = authUser.user.id;

    // Create participant profile
    const { error: profileError } = await supabaseAdmin
      .from('participants_profile')
      .insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email
      });

    if (profileError) {
      console.error('Error creating participant profile:', profileError);
      return res.status(500).json({ error: `Failed to create participant profile: ${profileError.message}` });
    }

    // Return success with user ID
    return res.status(200).json({ 
      success: true, 
      userId,
      message: 'Participant created successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
