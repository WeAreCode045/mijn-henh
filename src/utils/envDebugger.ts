
/**
 * Helper utility to debug environment variables
 * This can be used during initialization to verify env vars are loading correctly
 */
export const debugEnvironmentVariables = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'Not set',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
    NODE_ENV: import.meta.env.MODE || 'Not set'
  };

  console.log('Environment Variables:', envVars);
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Missing critical Supabase environment variables. Authentication will not work!');
  }
  
  return envVars;
};
