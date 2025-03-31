
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define the expected request body structure
interface EmailRequestBody {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

// Define the Mailjet configuration structure
interface MailjetConfig {
  api_key: string;
  api_secret: string;
  from_email: string;
  from_name: string;
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
    // Parse request body
    let requestBody: EmailRequestBody;
    try {
      requestBody = await req.json();
      console.log("Request body received:", JSON.stringify({
        to: requestBody.to,
        subject: requestBody.subject, 
        hasHtml: !!requestBody.html,
        hasText: !!requestBody.text
      }));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request body format" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { to, subject, html, text, cc, bcc, replyTo } = requestBody;

    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and either html or text are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get Mailjet configuration from the database
    const supabaseClient = createSupabaseClient(req);
    const { data: mailjetData, error: mailjetError } = await supabaseClient
      .from('agency_settings')
      .select('mailjet_api_key, mailjet_api_secret, mailjet_from_email, mailjet_from_name')
      .maybeSingle();

    if (mailjetError) {
      throw new Error(`Error fetching Mailjet settings: ${mailjetError.message}`);
    }

    if (!mailjetData || !mailjetData.mailjet_api_key || !mailjetData.mailjet_api_secret) {
      return new Response(
        JSON.stringify({ 
          error: "Mailjet is not configured. Please set up Mailjet settings in the Mail tab of Settings." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const mailjetConfig: MailjetConfig = {
      api_key: mailjetData.mailjet_api_key,
      api_secret: mailjetData.mailjet_api_secret,
      from_email: mailjetData.mailjet_from_email || "",
      from_name: mailjetData.mailjet_from_name || "",
    };

    console.log("Mailjet configuration:", JSON.stringify({
      api_key_length: mailjetConfig.api_key.length,
      api_secret_length: mailjetConfig.api_secret.length,
      from_email: mailjetConfig.from_email,
      from_name: mailjetConfig.from_name
    }));
    
    // Send email using Mailjet API directly with fetch
    try {
      const recipients = Array.isArray(to) ? to.map(email => ({ Email: email })) : [{ Email: to }];
      
      const ccRecipients = cc ? (Array.isArray(cc) ? cc.map(email => ({ Email: email })) : [{ Email: cc }]) : [];
      const bccRecipients = bcc ? (Array.isArray(bcc) ? bcc.map(email => ({ Email: email })) : [{ Email: bcc }]) : [];
      
      const fromEmail = mailjetConfig.from_email;
      const fromName = mailjetConfig.from_name || "";
      
      const mailjetPayload = {
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName
            },
            To: recipients,
            Cc: ccRecipients,
            Bcc: bccRecipients,
            Subject: subject,
            TextPart: text || undefined,
            HTMLPart: html || undefined,
            Headers: replyTo ? { "Reply-To": replyTo } : undefined
          }
        ]
      };

      console.log("Sending email via Mailjet with payload:", JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        hasHtml: !!html,
        hasText: !!text
      }));

      const mailjetResponse = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${mailjetConfig.api_key}:${mailjetConfig.api_secret}`)}`
        },
        body: JSON.stringify(mailjetPayload)
      });
      
      const mailjetResponseData = await mailjetResponse.json();
      
      if (!mailjetResponse.ok) {
        console.error("Mailjet API error:", mailjetResponseData);
        throw new Error(`Mailjet API error: ${JSON.stringify(mailjetResponseData)}`);
      }
      
      console.log("Email sent successfully via Mailjet:", mailjetResponseData);

      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully", data: mailjetResponseData }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (emailError) {
      console.error("Error sending email via Mailjet:", emailError);
      return new Response(
        JSON.stringify({ error: `Error sending email: ${emailError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Error in send-email-with-smtp function:", error);
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
