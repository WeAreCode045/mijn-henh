
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

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
    const { address, nearbyPlaces } = await req.json();

    if (!address) {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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
      nearbyPlaces.forEach((place: any) => {
        placesInfo += `- ${place.name} (${place.type}, ${place.distance} away)\n`;
      });
    }

    const prompt = `Write a concise but comprehensive location description for a property at "${address}". 
    ${placesInfo}
    Focus on the neighborhood, accessibility, lifestyle, and nearby amenities. 
    The description should be appealing to potential property buyers/renters.
    Limit the response to 3-4 paragraphs maximum. Write in a professional real estate style.`;

    console.log("Sending request to OpenAI with prompt:", prompt);

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
            content: "You are a professional real estate copywriter specializing in location descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

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
