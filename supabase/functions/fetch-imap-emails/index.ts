
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { ImapFlow } from "https://esm.sh/imapflow@1.0.148";

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
    const { 
      imapHost, 
      imapPort, 
      imapUsername, 
      imapPassword, 
      imapTls = true, 
      imapMailbox = "INBOX",
      testConnection = false 
    } = requestData;

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
      logger: false
    });

    try {
      // Connect to the server
      await client.connect();
      
      // If this is just a test connection request, return a simplified response
      if (testConnection) {
        console.log("Testing IMAP connection only");
        await client.logout();
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Connection test successful" 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      }

      // Select mailbox
      const mailbox = await client.mailboxOpen(imapMailbox);
      console.log(`Selected mailbox: ${mailbox.path}, contains ${mailbox.exists} messages`);
      
      const emails: EmailResponse[] = [];
      
      // Get emails (latest 20)
      const messageCount = mailbox.exists;
      const startIndex = Math.max(1, messageCount - 19); // Get up to the last 20 messages
      
      // Only fetch messages if there are any
      if (messageCount > 0) {
        // Fetch the last 20 messages
        for await (const message of client.fetch(`${startIndex}:*`, {
          envelope: true,
          bodyStructure: true,
          source: true,
          flags: true
        })) {
          const isRead = message.flags.includes("\\Seen");
          const from = message.envelope.from 
            ? message.envelope.from.map(addr => `${addr.name || ''} <${addr.address}>`).join(", ")
            : "Unknown";
          const to = message.envelope.to 
            ? message.envelope.to.map(addr => `${addr.name || ''} <${addr.address}>`).join(", ")
            : "Unknown";
          
          // Parse message body for display
          let body = "";
          let textBody = "";
          let htmlBody = "";
          
          // Try to extract body content if available
          if (message.source) {
            try {
              // Get text content from message
              const bodyParts = await extractBodyParts(message.source.toString());
              textBody = bodyParts.text || "";
              htmlBody = bodyParts.html || "";
              
              // Prefer HTML, fallback to text
              body = htmlBody || textBody || "No message content";
            } catch (bodyError) {
              console.error("Error extracting body:", bodyError);
              body = "Unable to extract message content";
            }
          }

          emails.push({
            id: message.uid.toString(),
            subject: message.envelope.subject || "(No Subject)",
            from,
            to,
            date: message.envelope.date?.toISOString() || new Date().toISOString(),
            body,
            textBody,
            htmlBody,
            isRead
          });
        }
      }

      // Disconnect from the server
      await client.logout();
      
      return new Response(
        JSON.stringify({ emails }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    } catch (imapError: any) {
      // Handle IMAP-specific errors
      console.error("IMAP connection error:", imapError);
      
      // Clean up if client was created
      if (client && client.usable) {
        await client.logout().catch(e => console.error("Error during logout:", e));
      }
      
      // If this was just a connection test, provide detailed error
      if (testConnection) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Connection failed: ${imapError.message || "Unknown error"}` 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      }
      
      throw imapError;
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

// Helper function to extract body parts from a message
async function extractBodyParts(message: string): Promise<{ text: string | null; html: string | null }> {
  // This is a simplified parser that attempts to extract text and HTML parts
  const result = { text: null, html: null };
  
  // Look for text/plain content
  const textMatch = message.match(/Content-Type: text\/plain[\s\S]*?\r\n\r\n([\s\S]*?)(?=\r\n--|\r\n\r\nContent-Type:|\r\n\r\n$)/i);
  if (textMatch && textMatch[1]) {
    result.text = textMatch[1].trim();
  }
  
  // Look for text/html content
  const htmlMatch = message.match(/Content-Type: text\/html[\s\S]*?\r\n\r\n([\s\S]*?)(?=\r\n--|\r\n\r\nContent-Type:|\r\n\r\n$)/i);
  if (htmlMatch && htmlMatch[1]) {
    result.html = htmlMatch[1].trim();
  }
  
  return result;
}
