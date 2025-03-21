
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Category configurations with includedTypes
const categoryConfigs = {
  education: {
    includedTypes: ['preschool', 'primary_school', 'school', 'secondary_school', 'university'],
    maxResults: 20
  },
  entertainment: {
    includedTypes: ['zoo', 'tourist_attraction', 'park', 'night_club', 'movie_theater', 'event_venue', 'concert_hall'],
    maxResults: 20
  },
  shopping: {
    includedTypes: ['supermarket', 'shopping_mall'],
    maxResults: 20
  },
  sports: {
    includedTypes: ['arena', 'fitness_center', 'golf_course', 'gym', 'sports_complex', 'stadium', 'swimming_pool'],
    maxResults: 20
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, apiKey, category, latitude, longitude, radius = 5000 } = await req.json()
    
    if (!apiKey) {
      throw new Error('API key is required')
    }

    // Use provided coordinates or geocode the address
    let lat = latitude;
    let lng = longitude;
    
    if (!lat || !lng) {
      if (!address) {
        throw new Error('Either coordinates or address must be provided')
      }
      
      // Geocode the address
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      )
      const geocodeData = await geocodeResponse.json()

      if (!geocodeData.results?.[0]?.geometry?.location) {
        throw new Error('Could not geocode address')
      }

      lat = geocodeData.results[0].geometry.location.lat;
      lng = geocodeData.results[0].geometry.location.lng;
    }

    console.log(`Using coordinates: ${lat}, ${lng}`);
    
    // Determine which categories to fetch
    let categoriesToFetch = Object.keys(categoryConfigs);
    
    // If a specific category was requested, only fetch that one
    if (category && categoryConfigs[category]) {
      console.log(`Fetching only category: ${category}`);
      categoriesToFetch = [category];
    } else if (category) {
      // If it's a custom type that's not one of our main categories
      // Find which category contains this type
      let foundCategory = null;
      
      for (const [catKey, catConfig] of Object.entries(categoryConfigs)) {
        if (catConfig.includedTypes.includes(category)) {
          foundCategory = catKey;
          break;
        }
      }
      
      if (foundCategory) {
        categoriesToFetch = [foundCategory];
        // Override the included types to be just the requested one
        categoryConfigs[foundCategory] = {
          ...categoryConfigs[foundCategory],
          includedTypes: [category]
        };
      } else {
        // If it's a completely custom type, create a single category for it
        categoriesToFetch = ['custom'];
        categoryConfigs.custom = {
          includedTypes: [category],
          maxResults: 20
        };
      }
    }

    // Fetch places for each category
    const results = {};
    
    for (const categoryKey of categoriesToFetch) {
      const config = categoryConfigs[categoryKey];
      const includedTypes = config.includedTypes;
      const maxResults = config.maxResults;
      
      console.log(`Fetching places for category ${categoryKey} with types:`, includedTypes);
      
      try {
        // Make request to Places API v1
        const requestBody = {
           "includedTypes": [
    includedTypes
  ],
  "maxResultCount": 10,
  "locationRestriction": {
    "circle": {
      "center": {
        "latitude": lat,
        "longitude": lng
      },
      "radius": 5000
    }
          }
        };
        {
        console.log(`Request body for ${categoryKey}:`, JSON.stringify(requestBody));
        
        const placesResponse = await fetch(
          'https://places.googleapis.com/v1/places:searchNearby',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.primaryType,places.types,places.location'
            },
            body: JSON.stringify(requestBody)
          }
        );
        
        const placesData = await placesResponse.json();
        
        if (placesData.places && Array.isArray(placesData.places)) {
          // Transform the data to match our expected format
          const transformedPlaces = placesData.places.map(place => {
            // Calculate distance (could be added if needed)
            // For now, just providing placeholder
            const distance = "nearby";
            
            return {
              id: place.id,
              name: place.displayName?.text || 'Unknown Place',
              vicinity: place.formattedAddress || '',
              rating: place.rating || 0,
              user_ratings_total: place.userRatingCount || 0,
              type: place.primaryType || categoryKey,
              types: place.types || [],
              distance: distance,
              visible_in_webview: true,
              latitude: place.location?.latitude,
              longitude: place.location?.longitude
            };
          });
          
          results[categoryKey] = transformedPlaces;
          
          // Also add to specific type keys for backward compatibility
          if (categoryKey !== 'custom') {
            for (const type of includedTypes) {
              const placesOfType = transformedPlaces.filter(p => 
                p.type === type || (p.types && p.types.includes(type))
              );
              if (placesOfType.length > 0) {
                results[type] = placesOfType;
              }
            }
          }
        } else {
          console.log(`No places found for category ${categoryKey}:`, placesData);
          results[categoryKey] = [];
        }
      } catch (error) {
        console.error(`Error fetching places for category ${categoryKey}:`, error);
        results[categoryKey] = [];
      }
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
        // Flatten all results into a single array
        const allPlaces = Object.values(results).flat();
        
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
    }

    return new Response(
      JSON.stringify(results),
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
