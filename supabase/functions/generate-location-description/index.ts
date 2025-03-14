
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
    const { address, nearbyPlaces, language = 'nl' } = await req.json();

    if (!address) {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
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

    // Prepare prompt with nearby places information
    let placesInfo = "";
    if (nearbyPlaces && nearbyPlaces.length > 0) {
      placesInfo = "Nearby places include:\n";
      
      // Group places by type for better context
      const placesByType: Record<string, any[]> = {};
      nearbyPlaces.forEach((place: any) => {
        if (!placesByType[place.type]) {
          placesByType[place.type] = [];
        }
        placesByType[place.type].push(place);
      });
      
      // Add nearby places by type with distances
      Object.entries(placesByType).forEach(([type, places]) => {
        placesInfo += `- ${type.replace('_', ' ')}: ${places.map(p => `${p.name} (${p.distance || 'unknown'} km)`).join(', ')}\n`;
      });
    }

    const systemPrompt = `You are a professional real estate copywriter specializing in location descriptions.
Your task is to write compelling location descriptions for property listings in Dutch.
Focus on the property's neighborhood advantages, accessibility, and lifestyle benefits.
Highlight proximity to amenities, transportation, and attractive features of the area.
Write in a professional but warm tone that appeals to potential buyers/renters.
Keep descriptions factual, positive, and focused on what makes the location desirable.`;

    const userPrompt = `Write a concise but comprehensive location description in Dutch for a property at "${address}".
${placesInfo}
The description should be appealing to potential property buyers/renters.
Limit the response to 3-4 paragraphs maximum.
Highlight neighborhood quality, accessibility, and nearby amenities.
Include information about transportation options if available.
Always write in Dutch, as this is for the Dutch real estate market.`;

    console.log("Sending request to OpenAI");

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

    const description = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ description: description.trim() }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-location-description function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
