
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { ImapFlow } from "https://esm.sh/imapflow@1.0.157";

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
    const client = new ImapFlow({
      host: imapHost,
      port: parseInt(imapPort),
      secure: imapTls,
      auth: {
        user: imapUsername,
        pass: imapPassword
      },
      logger: true
    });

    try {
      // Connect to the IMAP server
      await client.connect();
      console.log("Connected to IMAP server");

      // Open the mailbox
      const mailbox = await client.mailboxOpen(imapMailbox);
      console.log(`Selected mailbox: ${imapMailbox}, message count: ${mailbox.exists}`);

      const emails: EmailResponse[] = [];
      
      if (mailbox.exists > 0) {
        // Calculate the range for the most recent 20 emails
        const startSeq = Math.max(1, mailbox.exists - 19);
        const endSeq = mailbox.exists;
        
        console.log(`Fetching emails from sequence range: ${startSeq}:${endSeq}`);
        
        // Fetch the most recent 20 emails
        for await (const message of client.fetch(`${startSeq}:${endSeq}`, { 
          uid: true, 
          flags: true, 
          envelope: true, 
          bodyStructure: true, 
          source: true 
        })) {
          console.log(`Processing message ${message.seq} with UID ${message.uid}`);
          
          // Extract envelope data
          const envelope = message.envelope;
          const isRead = message.flags.includes("\\Seen");
          
          const from = envelope.from?.[0] ? 
            `${envelope.from[0].name || ''} <${envelope.from[0].address}>` : 
            "Unknown Sender";
            
          const to = envelope.to?.[0] ? 
            `${envelope.to[0].name || ''} <${envelope.to[0].address}>` : 
            "Unknown Recipient";

          // Get the raw source of the message
          const source = message.source.toString();
          
          // Create the email response object
          emails.push({
            id: message.uid.toString(),
            subject: envelope.subject || "(No Subject)",
            from,
            to,
            date: new Date(envelope.date || Date.now()).toISOString(),
            body: source,
            isRead
          });
        }
      }
      
      // Close the connection
      await client.logout();
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
        await client.logout();
      } catch (disconnectError) {
        console.error("Error disconnecting:", disconnectError);
      }
      
      throw error;
    }
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
