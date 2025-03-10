
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gjvpptmwijiosgdcozep.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnBwdG13aWppb3NnZGNvemVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNDY2MjgsImV4cCI6MjA1NDcyMjYyOH0.-y3EH6GCtlig7d2FGTcSuyAAYtGsKbP4NrKeaMD-OMg";

// Create the main Supabase client
export const mainSupabaseClient = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Create a backup Supabase client with the same credentials
export const backupSupabaseClient = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Track which client is currently active
let activeClient = mainSupabaseClient;
let isMainClientFailed = false;

// Function to check if a client is available
const isClientAvailable = async (client: any): Promise<boolean> => {
  if (!client || !client.auth) {
    return false;
  }
  
  try {
    // Attempt a lightweight operation to verify connection
    await client.auth.getSession();
    return true;
  } catch (error) {
    console.error('Supabase client check failed:', error);
    return false;
  }
};

// Function to get the best available client
export const getSupabaseClient = async (): Promise<any> => {
  console.log('Getting Supabase client, current active:', isMainClientFailed ? 'backup' : 'main');
  
  // Try the currently active client first
  if (await isClientAvailable(activeClient)) {
    return activeClient;
  }
  
  console.warn('Active Supabase client unavailable, trying alternative');
  
  // Switch to the other client
  if (activeClient === mainSupabaseClient) {
    activeClient = backupSupabaseClient;
    isMainClientFailed = true;
  } else {
    activeClient = mainSupabaseClient;
    isMainClientFailed = false;
  }
  
  // Check if the new active client is available
  if (await isClientAvailable(activeClient)) {
    console.log('Switched to', isMainClientFailed ? 'backup' : 'main', 'Supabase client');
    return activeClient;
  }
  
  console.error('All Supabase clients unavailable');
  return null;
};

// The default client that will be used throughout the application
// This is exported for backward compatibility
export const supabase = mainSupabaseClient;

// Function to synchronize sessions between clients
export const syncSupabaseClients = async (): Promise<void> => {
  try {
    const { data: mainSession } = await mainSupabaseClient.auth.getSession();
    const { data: backupSession } = await backupSupabaseClient.auth.getSession();
    
    // If main has a session but backup doesn't, sync to backup
    if (mainSession?.session && !backupSession?.session) {
      console.log('Syncing session from main to backup client');
      await backupSupabaseClient.auth.setSession({
        access_token: mainSession.session.access_token,
        refresh_token: mainSession.session.refresh_token,
      });
    } 
    // If backup has a session but main doesn't, sync to main
    else if (!mainSession?.session && backupSession?.session) {
      console.log('Syncing session from backup to main client');
      await mainSupabaseClient.auth.setSession({
        access_token: backupSession.session.access_token,
        refresh_token: backupSession.session.refresh_token,
      });
    }
  } catch (error) {
    console.error('Error syncing Supabase clients:', error);
  }
};

// Initial sync when module is loaded
syncSupabaseClients().catch(console.error);
