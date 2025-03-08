
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  property_id: string;
  property_title: string;
  submission_id: string;
  agent_email: string;
  agent_name: string;
  inquiry_name: string;
  inquiry_email: string;
  inquiry_phone: string;
  inquiry_message: string;
  inquiry_type: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const submission: ContactSubmission = await req.json();
    
    // Add some logging to help with debugging
    console.log("Processing submission:", {
      property_id: submission.property_id,
      to: submission.agent_email,
      subject: `New inquiry for ${submission.property_title}`,
      from_address: Deno.env.get("EMAILENGINE_FROM_ADDRESS")
    });
    
    // EmailEngine API call
    const response = await fetch(`${Deno.env.get("EMAILENGINE_API_URL")}/api/v1/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": Deno.env.get("EMAILENGINE_API_KEY") || "",
      },
      body: JSON.stringify({
        to: submission.agent_email,
        subject: `New inquiry for ${submission.property_title}`,
        html: `
          <h2>New Property Inquiry</h2>
          <p>Dear ${submission.agent_name},</p>
          <p>You have received a new inquiry for property: ${submission.property_title}</p>
          <h3>Contact Details:</h3>
          <ul>
            <li>Name: ${submission.inquiry_name}</li>
            <li>Email: ${submission.inquiry_email}</li>
            <li>Phone: ${submission.inquiry_phone}</li>
            <li>Inquiry Type: ${submission.inquiry_type}</li>
          </ul>
          <h3>Message:</h3>
          <p>${submission.inquiry_message}</p>
        `,
        from: {
          name: "Property Inquiry",
          address: Deno.env.get("EMAILENGINE_FROM_ADDRESS") || "noreply@yourdomain.com"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailEngine API error response:", errorText);
      throw new Error(`EmailEngine API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
