
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
    const { keywords, areaName, language = 'en' } = await req.json();

    if (!keywords || keywords.length === 0) {
      return new Response(
        JSON.stringify({ error: "Keywords are required" }),
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

    // Format keywords for the prompt
    const keywordsFormatted = keywords.join(", ");
    const areaTitle = areaName || "this area";

    const systemPrompt = `You are a professional real estate copywriter specializing in creating appealing descriptions of property areas.
Your task is to write compelling descriptions that highlight the features and atmosphere of specific areas in properties.
Focus on creating vivid, engaging content that helps potential buyers or renters visualize the space.
Keep the tone professional, warm, and inviting.`;

    const userPrompt = `Write a concise but detailed description for ${areaTitle} of a property.
The description should incorporate these keywords: ${keywordsFormatted}.
Create approximately 2-3 paragraphs of text that paint a picture of the space.
Focus on atmosphere, functionality, and aesthetic appeal.
The description should be appealing to potential property buyers/renters.`;

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
    console.error("Error in generate-area-description function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
