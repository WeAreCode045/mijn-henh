
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, apiKey, category } = await req.json()
    
    if (!address || !apiKey) {
      throw new Error('Address and API key are required')
    }

    // First, get coordinates from the address
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData.results?.[0]?.geometry?.location) {
      throw new Error('Could not geocode address')
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    let categories = [
      { type: 'school', name: 'education' },
      { type: 'shopping_mall', name: 'shopping' },
      { type: 'transit_station', name: 'transit' },
      { type: 'bus_station', name: 'bus' },
      { type: 'gym', name: 'sports' }
    ]
    
    // If a specific category was requested, only fetch that one
    if (category) {
      console.log(`Fetching only category: ${category}`);
      const matchingCategory = categories.find(c => c.name === category || c.type === category);
      
      if (matchingCategory) {
        categories = [matchingCategory];
      } else {
        // If it's a custom category/subtype that's not in our default list
        categories = [{ type: category, name: category }];
      }
    }

    // Fetch places for each category
    const placesPromises = categories.map(async (category) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${category.type}&key=${apiKey}`
      )
      const data = await response.json()
      return {
        category: category.name,
        places: data.results || []
      }
    })

    const results = await Promise.all(placesPromises)

    // Process and structure the results
    const processedResults = {}
    
    // Only include the categories we actually fetched
    results.forEach(result => {
      processedResults[result.category] = result.places;
    });

    // If a specific category was requested, also assign it to its own key
    if (category) {
      const resultCategory = results.length > 0 ? results[0].category : category;
      const places = results.length > 0 ? results[0].places : [];
      processedResults[category] = places;
    }

    // Update the property with the new data if propertyId is provided
    const propertyId = req.url.split('?')[1]?.split('=')[1]
    if (propertyId) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Only update nearby_places if category is not specified (full fetch)
      // For partial fetches, we just return the results without updating the database
      if (!category) {
        const { error: updateError } = await supabaseAdmin
          .from('properties')
          .update({
            latitude: lat,
            longitude: lng,
            nearby_places: results.flatMap(r => r.places)
          })
          .eq('id', propertyId)

        if (updateError) {
          throw updateError
        }
      }
    }

    return new Response(
      JSON.stringify(processedResults),
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
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
