
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, nearbyPlaces, language = 'nl' } = await req.json()

    // Prepare nearby places descriptions in Dutch
    const placesDescription = nearbyPlaces
      .map(place => {
        const type = place.type === 'public_transport' 
          ? 'openbaar vervoer' 
          : place.type.replace(/_/g, ' ')
        return `${place.name} (${type})`
      })
      .join(', ')

    const prompt = `
      Genereer een aantrekkelijke en informatieve beschrijving in het Nederlands voor een woning op het volgende adres: ${address}.
      
      Nabijgelegen voorzieningen zijn: ${placesDescription}.
      
      De beschrijving moet:
      1. De locatie en bereikbaarheid van de woning beschrijven
      2. De nabijgelegen voorzieningen en hun voordelen benadrukken
      3. Professioneel en wervend zijn, maar wel feitelijk correct
      4. Ongeveer 3-4 zinnen lang zijn
      5. In het Nederlands geschreven zijn
    `

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Je bent een ervaren makelaar die locatiebeschrijvingen schrijft voor woningen in Nederland.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    const data = await response.json()
    const description = data.choices[0].message.content.trim()

    return new Response(
      JSON.stringify({ description }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
