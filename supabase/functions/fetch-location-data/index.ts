
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

interface NearbyCity {
  name: string;
  distance: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, apiKey, propertyId, openaiApiKey } = await req.json()
    
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

    // Get details about the location (admin levels)
    const locationDetails = geocodeData.results[0].address_components || [];
    const cityComponent = locationDetails.find(
      (comp: any) => comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
    );
    const regionComponent = locationDetails.find(
      (comp: any) => comp.types.includes('administrative_area_level_1')
    );
    const countryComponent = locationDetails.find(
      (comp: any) => comp.types.includes('country')
    );
    
    const city = cityComponent?.long_name || '';
    const region = regionComponent?.long_name || '';
    const country = countryComponent?.long_name || '';

    // Categories to search for
    const categories = [
      { type: 'school', name: 'education' },
      { type: 'shopping_mall', name: 'shopping' },
      { type: 'transit_station', name: 'transit' },
      { type: 'bus_station', name: 'transportation' },
      { type: 'supermarket', name: 'shopping' },
      { type: 'gym', name: 'sports' }
    ]

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

    // Process and filter places by rating (>= 3.5) and only take top 3 for each category
    const filteredPlaces: NearbyPlace[] = []
    
    results.forEach(categoryResult => {
      const places = categoryResult.places
        .filter((place: any) => place.rating >= 3.5)
        .sort((a: any, b: any) => b.rating - a.rating)
        .slice(0, 3)
        .map((place: any) => ({
          id: place.place_id,
          name: place.name,
          type: categoryResult.category,
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total || 0
        }))
      
      filteredPlaces.push(...places)
    })

    // Get static map image
    const mapWidth = 800
    const mapHeight = 400
    const zoom = 15
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${mapWidth}x${mapHeight}&key=${apiKey}&markers=color:red%7C${lat},${lng}`
    
    const mapResponse = await fetch(mapUrl)
    const mapBlob = await mapResponse.blob()
    const mapBase64 = await blobToBase64(mapBlob)

    // Find nearby cities (cities within 300km)
    const nearbyCities: NearbyCity[] = []
    if (city) {
      // First, try to get major cities within the same region/country
      // This is a simplified approach - in a real implementation, we'd query a database of cities with populations
      // For this demo, we'll use a few hardcoded methods to find nearby cities
      
      // Here we'd integrate with a more comprehensive cities database
      // As a simplified example, we'll just search for a few random cities around the provided coordinates
      const radiusKm = 300
      const directions = [0, 60, 120, 180, 240, 300] // Directions in degrees to search
      
      // To properly implement this, we would need to use a cities database with population data
      // For demo purposes, we'll generate "nearby cities" around the property location
      for (const direction of directions) {
        const distanceKm = Math.random() * radiusKm
        const { lat: cityLat, lng: cityLng } = moveCoordinates(lat, lng, distanceKm, direction)
        
        // Get city name at this location
        try {
          const cityResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${cityLat},${cityLng}&result_type=locality&key=${apiKey}`
          )
          const cityData = await cityResponse.json()
          
          if (cityData.results && cityData.results.length > 0) {
            const cityName = cityData.results[0].address_components.find(
              (comp: any) => comp.types.includes('locality')
            )?.long_name
            
            if (cityName && cityName !== city) {
              nearbyCities.push({
                name: cityName,
                distance: Math.round(distanceKm)
              })
            }
          }
        } catch (e) {
          console.error('Error fetching city name:', e)
        }
      }
    }

    // Generate location description with OpenAI
    let locationDescription = ''
    if (openaiApiKey) {
      try {
        const prompt = `Write a concise description (max 3 paragraphs) for a property located in ${city}, ${region}, ${country}. 
        Include information about the area, its characteristics, amenities, and why it's a desirable place to live. 
        Focus on the positive aspects of living in this location. Keep the tone professional and suitable for a real estate listing.
        The description should be factual and informative, highlighting what makes ${city} special.`
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a professional real estate copywriter who creates compelling location descriptions.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
          }),
        })

        const data = await response.json()
        locationDescription = data.choices[0].message.content.trim()
      } catch (error) {
        console.error('Error generating location description:', error)
        // Continue even if description generation fails
      }
    }

    // Update the property with the new data
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (propertyId) {
      const updateData: any = {
        latitude: lat,
        longitude: lng,
        map_image: mapBase64,
        nearby_places: filteredPlaces,
        nearby_cities: nearbyCities
      }
      
      if (locationDescription) {
        updateData.location_description = locationDescription
      }
      
      const { error: updateError } = await supabaseAdmin
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)

      if (updateError) {
        throw updateError
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          latitude: lat,
          longitude: lng,
          mapImage: mapBase64,
          nearbyPlaces: filteredPlaces,
          nearbyCities: nearbyCities,
          locationDescription: locationDescription
        }
      }),
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
      JSON.stringify({
        success: false,
        error: error.message
      }),
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

// Helper function to encode an image blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  let binary = ''
  uint8Array.forEach(byte => binary += String.fromCharCode(byte))
  return `data:image/png;base64,${btoa(binary)}`
}

// Helper function to move coordinates by distance in km
function moveCoordinates(lat: number, lng: number, distanceKm: number, direction: number): { lat: number, lng: number } {
  // Earth's radius in km
  const R = 6371
  
  // Convert direction to radians
  const dirRad = direction * Math.PI / 180
  
  // Calculate new coordinates
  const latRad = lat * Math.PI / 180
  const lngRad = lng * Math.PI / 180
  
  // Calculate new latitude
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceKm / R) +
    Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(dirRad)
  )
  
  // Calculate new longitude
  const newLngRad = lngRad + Math.atan2(
    Math.sin(dirRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
    Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
  )
  
  // Convert back to degrees
  const newLat = newLatRad * 180 / Math.PI
  const newLng = newLngRad * 180 / Math.PI
  
  return { lat: newLat, lng: newLng }
}
