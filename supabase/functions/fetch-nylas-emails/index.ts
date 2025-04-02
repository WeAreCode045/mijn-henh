
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailResponse {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body?: string;
  textBody?: string;
  htmlBody?: string;
  isRead: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Nylas settings from the request body
    const requestData = await req.json();
    
    // Accept both parameter names for backward compatibility
    const { 
      nylasGrantId, 
      nylasAccessToken,
      limit = 20
    } = requestData;
    
    // Use either parameter that's provided
    const accessToken = nylasGrantId || nylasAccessToken;

    // Validate required parameters
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing Nylas access token" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Connecting to Nylas API with access token`);
    
    // Fetch emails from Nylas API
    const response = await fetch(`https://api.nylas.com/messages?limit=${limit}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nylas API error:", errorText);
      throw new Error(`Nylas API returned ${response.status}: ${errorText}`);
    }

    const messages = await response.json();
    console.log(`Retrieved ${messages.length} messages from Nylas API`);

    // Transform messages to expected format
    const emails: EmailResponse[] = messages.map((message: any) => {
      // Format from and to fields
      const fromData = message.from && message.from.length > 0 
        ? `${message.from[0].name || ""} <${message.from[0].email}>`
        : "Unknown";
      
      const toData = message.to && message.to.length > 0
        ? message.to.map((to: any) => `${to.name || ""} <${to.email}>`).join(", ")
        : "Unknown";

      return {
        id: message.id,
        subject: message.subject || "(No Subject)",
        from: fromData,
        to: toData,
        date: new Date(message.date * 1000).toISOString(),
        body: message.body,
        htmlBody: message.body,
        textBody: message.snippet,
        isRead: !message.unread
      };
    });

    return new Response(
      JSON.stringify({ emails }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch emails", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
