
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, propertyType } = await req.json();

    if (!description) {
      return new Response(
        JSON.stringify({ error: "Property description is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Sending request to OpenAI to generate property areas");

    const propertyTypePrefix = propertyType 
      ? `This is a ${propertyType} property. `
      : "";

    const systemPrompt = `You are a professional real estate analyst. Your task is to identify and list the distinct areas/rooms in a property based on the provided description.`;

    const userPrompt = `${propertyTypePrefix}Based on the following property description, identify all distinct areas/rooms that should be featured in a property listing. 
    
Description: "${description}"

For each area, provide:
1. A title (e.g., "Living Room", "Kitchen", "Master Bedroom", "Garden")
2. A short descriptive name (just a simple label)
3. A size description if mentioned (e.g., "12 sqm", "Large", or leave blank if not mentioned)
4. A brief description highlighting key features (2-3 sentences)

Format your response as a JSON array with objects containing fields: title, name, size, description.
Each object should represent one distinct area of the property.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("Received response from OpenAI");

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    const areaContent = data.choices[0].message.content;
    
    // Try to parse the JSON content
    let areas;
    try {
      // Remove any markdown formatting if present
      const jsonString = areaContent.replace(/```json|```/g, '').trim();
      areas = JSON.parse(jsonString);
      
      if (!Array.isArray(areas)) {
        throw new Error("Response is not an array");
      }
      
      console.log("Successfully parsed areas:", areas);
    } catch (error) {
      console.error("Failed to parse JSON from OpenAI response:", error);
      console.log("Raw content:", areaContent);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse areas from OpenAI response",
          raw: areaContent 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ areas }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-property-areas function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
