
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "https://deno.land/x/imap@v2.1.0/mod.ts";

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
    // Get the IMAP settings from the request body
    const requestData = await req.json();
    const { imapHost, imapPort, imapUsername, imapPassword, imapTls = true, imapMailbox = "INBOX" } = requestData;

    // Validate required parameters
    if (!imapHost || !imapPort || !imapUsername || !imapPassword) {
      return new Response(
        JSON.stringify({ error: "Missing required IMAP settings" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Connecting to IMAP server: ${imapHost}:${imapPort} with user ${imapUsername}`);
    
    // Create IMAP client
    const client = new Client({
      host: imapHost,
      port: parseInt(imapPort),
      username: imapUsername,
      password: imapPassword,
      tls: imapTls,
      autotls: "always",
    });

    try {
      // Connect to the IMAP server
      await client.connect();
      console.log("Connected to IMAP server");

      // Open the mailbox
      await client.selectMailbox(imapMailbox);
      console.log(`Selected mailbox: ${imapMailbox}`);

      // Fetch the most recent 20 emails
      const messages = await client.listMessages(
        imapMailbox,
        "1:20",
        ["uid", "flags", "envelope", "body[]"]
      );
      console.log(`Found ${messages.length} messages`);

      // Transform messages into a more usable format
      const emails: EmailResponse[] = messages.map(message => {
        // Check if the email has been read
        const isRead = message.flags && message.flags.includes("\\Seen");
        
        // Extract envelope data
        const envelope = message.envelope;
        const from = envelope.from?.[0] ? 
          `${envelope.from[0].name || ''} <${envelope.from[0].mailbox}@${envelope.from[0].host}>` : 
          "Unknown Sender";
          
        const to = envelope.to?.[0] ? 
          `${envelope.to[0].name || ''} <${envelope.to[0].mailbox}@${envelope.to[0].host}>` : 
          "Unknown Recipient";

        // Get the body content (may be HTML or plain text)
        const body = message["body[]"];
        
        return {
          id: message.uid || String(Math.random()),
          subject: envelope.subject || "(No Subject)",
          from,
          to,
          date: new Date(envelope.date || Date.now()).toISOString(),
          body,
          isRead
        };
      });

      // Close the connection
      await client.disconnect();
      console.log("Disconnected from IMAP server");

      // Return the emails
      return new Response(
        JSON.stringify({ emails }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    } catch (error) {
      console.error("IMAP operation failed:", error);
      
      // Make sure to disconnect if there's an error
      try {
        await client.disconnect();
      } catch {}
      
      throw error;
    }
  } catch (error) {
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
