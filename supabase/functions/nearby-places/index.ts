
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

    // Define category to types mapping
    const categoryToTypes = {
      'education': ['preschool', 'primary_school', 'school', 'secondary_school', 'university'],
      'entertainment': ['zoo', 'tourist_attraction', 'park', 'night_club', 'movie_theater', 'event_venue', 'concert_hall'],
      'shopping': ['supermarket', 'shopping_mall'],
      'sports': ['arena', 'fitness_center', 'golf_course', 'gym', 'sports_complex', 'stadium', 'swimming_pool'],
      'transportation': ['transit_station', 'bus_station', 'train_station']
    }
    
    // Default to look for all categories if no specific category provided
    let typesToSearch = []
    
    // If a specific category was requested, get its types
    if (category) {
      // Check if it's a main category
      if (categoryToTypes[category]) {
        typesToSearch = categoryToTypes[category]
      } else {
        // It might be a specific subtype
        typesToSearch = [category] 
      }
    }
    
    // Fetch places using the Google Places API v1
    const fetchPlaces = async (types) => {
      const placesUrl = 'https://places.googleapis.com/v1/places:searchNearby'
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress,places.rating,places.userRatingCount,places.primaryType,places.types',
        'Content-Type': 'application/json'
      }
      
      const requestBody = {
        includedTypes: types,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: 1500  // 1.5 km radius
          }
        }
      }
      
      const response = await fetch(placesUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Places API error: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      return data.places || []
    }
    
    // Process results
    const processResults = async () => {
      let result = {}
      
      if (typesToSearch.length > 0) {
        // Fetch for specific types
        try {
          const places = await fetchPlaces(typesToSearch)
          
          // Transform data to the expected format
          const transformedPlaces = places.map(place => ({
            place_id: place.id,
            name: place.displayName?.text || "Unknown",
            vicinity: place.formattedAddress || "",
            rating: place.rating || 0,
            user_ratings_total: place.userRatingCount || 0,
            types: place.types || [place.primaryType],
            type: category || place.primaryType,
            distance: 0  // Unfortunately, distance isn't directly provided
          }))
          
          // Assign to the appropriate category
          result[category || 'places'] = transformedPlaces
        } catch (error) {
          console.error(`Error fetching places for types ${typesToSearch}:`, error)
          result[category || 'places'] = []
        }
      } else {
        // Fetch multiple categories
        for (const [categoryName, types] of Object.entries(categoryToTypes)) {
          try {
            const places = await fetchPlaces(types)
            
            // Transform data to the expected format
            const transformedPlaces = places.map(place => ({
              place_id: place.id,
              name: place.displayName?.text || "Unknown",
              vicinity: place.formattedAddress || "",
              rating: place.rating || 0,
              user_ratings_total: place.userRatingCount || 0,
              types: place.types || [place.primaryType],
              type: categoryName,
              distance: 0
            }))
            
            result[categoryName] = transformedPlaces
          } catch (error) {
            console.error(`Error fetching places for category ${categoryName}:`, error)
            result[categoryName] = []
          }
        }
      }
      
      return result
    }
    
    const processedResults = await processResults()
    
    // Add other results for backward compatibility
    const resultWithCoordinates = {
      success: true,
      latitude: lat,
      longitude: lng,
      ...processedResults
    }

    // Update the property with the new data if propertyId is provided
    const propertyId = req.url.split('?')[1]?.split('=')[1]
    if (propertyId && !category) {  // Only update if this is a full fetch
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Create a flattened array of all places
      const allPlaces = Object.values(processedResults).flat()
      
      const { error: updateError } = await supabaseAdmin
        .from('properties')
        .update({
          latitude: lat,
          longitude: lng,
          nearby_places: allPlaces
        })
        .eq('id', propertyId)

      if (updateError) {
        throw updateError
      }
    }

    return new Response(
      JSON.stringify(resultWithCoordinates),
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
