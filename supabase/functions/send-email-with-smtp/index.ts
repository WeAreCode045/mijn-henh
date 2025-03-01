
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Define the expected request body structure
interface EmailRequestBody {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

// Define the SMTP configuration structure
interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  secure: boolean;
}

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get SMTP configuration from the database
    const supabaseClient = createSupabaseClient(req);
    const { data: smtpData, error: smtpError } = await supabaseClient
      .from('agency_settings')
      .select('smtp_host, smtp_port, smtp_username, smtp_password, smtp_from_email, smtp_from_name, smtp_secure')
      .maybeSingle();

    if (smtpError) {
      throw new Error(`Error fetching SMTP settings: ${smtpError.message}`);
    }

    if (!smtpData || !smtpData.smtp_host || !smtpData.smtp_username || !smtpData.smtp_password) {
      return new Response(
        JSON.stringify({ 
          error: "SMTP is not configured. Please set up SMTP settings in the Advanced tab of Settings." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const smtpConfig: SMTPConfig = {
      host: smtpData.smtp_host,
      port: parseInt(smtpData.smtp_port || "587"),
      username: smtpData.smtp_username,
      password: smtpData.smtp_password,
      from_email: smtpData.smtp_from_email || smtpData.smtp_username,
      from_name: smtpData.smtp_from_name || "",
      secure: smtpData.smtp_secure === true,
    };

    // Parse request body
    const { to, subject, html, text, cc, bcc, replyTo }: EmailRequestBody = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and html are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Configure SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: smtpConfig.host,
        port: smtpConfig.port,
        tls: smtpConfig.secure,
        auth: {
          username: smtpConfig.username,
          password: smtpConfig.password,
        },
      }
    });

    // Send email
    await client.send({
      from: smtpConfig.from_name 
        ? `${smtpConfig.from_name} <${smtpConfig.from_email}>` 
        : smtpConfig.from_email,
      to: Array.isArray(to) ? to : [to],
      subject,
      content: text ? text : undefined,
      html: html,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      replyTo: replyTo,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Helper function to create a Supabase client from the request
function createSupabaseClient(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  
  // Create a custom fetch function that includes the authorization header
  const supabaseFetch = (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    headers.set("apikey", supabaseKey);
    headers.set("Authorization", `Bearer ${supabaseKey}`);
    
    return fetch(url, {
      ...options,
      headers,
    });
  };
  
  // Simple implementation of the Supabase client for this edge function
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        maybeSingle: async () => {
          try {
            const response = await supabaseFetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns}`,
              { method: "GET" }
            );
            
            if (!response.ok) {
              const error = await response.json();
              return { data: null, error };
            }
            
            const data = await response.json();
            return { data: data[0] || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    })
  };
}
