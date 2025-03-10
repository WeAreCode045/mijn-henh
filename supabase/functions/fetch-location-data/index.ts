
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface PlaceResult {
  place_id: string;
  name: string;
  types: string[];
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address, apiKey, propertyId } = await req.json()

    if (!address) {
      throw new Error('Address is required')
    }

    // First, get coordinates from address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    const geocodeRes = await fetch(geocodeUrl)
    const geocodeData = await geocodeRes.json()

    if (!geocodeData.results?.[0]?.geometry?.location) {
      throw new Error('Could not find location for address')
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    // Get nearby places
    const placeTypes = [
      'supermarket',
      'shopping_mall',
      'school',
      'park',
      'restaurant',
      'train_station',
      'bus_station'
    ]

    const radius = 1500 // 1.5km radius
    const placesPromises = placeTypes.map(type => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`
      return fetch(url).then(res => res.json())
    })

    const placesResults = await Promise.all(placesPromises)
    
    // Get static map image
    const mapWidth = 800
    const mapHeight = 400
    const zoom = 15
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${mapWidth}x${mapHeight}&key=${apiKey}&markers=color:red%7C${lat},${lng}`
    
    const mapResponse = await fetch(mapUrl)
    const mapBlob = await mapResponse.blob()
    const mapBase64 = await blobToBase64(mapBlob)

    // Process and combine all nearby places
    const nearbyPlaces = placesResults.flatMap((result, index) => {
      if (!result.results) return []
      
      return result.results
        .filter((place: PlaceResult) => 
          (place.rating || 0) >= 3.5 && 
          (place.user_ratings_total || 0) > 5
        )
        .slice(0, 5)
        .map((place: PlaceResult) => ({
          id: place.place_id,
          name: place.name,
          type: placeTypes[index],
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total
        }))
    })

    // Update property with location data
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } = await supabase
      .from('properties')
      .update({
        latitude: lat,
        longitude: lng,
        map_image: mapBase64,
        nearby_places: nearbyPlaces
      })
      .eq('id', propertyId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          latitude: lat,
          longitude: lng,
          mapImage: mapBase64,
          nearbyPlaces: nearbyPlaces
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

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  let binary = ''
  uint8Array.forEach(byte => binary += String.fromCharCode(byte))
  return `data:image/png;base64,${btoa(binary)}`
}
