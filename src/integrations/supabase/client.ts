
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjvpptmwijiosgdcozep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnBwdG13aWppb3NnZGNvemVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNDY2MjgsImV4cCI6MjA1NDcyMjYyOH0.-y3EH6GCtlig7d2FGTcSuyAAYtGsKbP4NrKeaMD-OMg';

// For browser environment
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// For admin operations. This can be used in edge functions but not in browser code.
// Create a function for admin operations to be called from edge functions
export const createAdminClient = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    }
  });
};
