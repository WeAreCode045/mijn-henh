
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './constants.ts'
import { geocodeAddress } from './geocoding.ts'
import { fetchPlacesFromAPI } from './places-api.ts'
import { updatePropertyWithPlaces } from './database.ts'
import { categoryConfigs } from './constants.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, apiKey, category, latitude, longitude, radius = 5000, propertyId } = await req.json()
    
    if (!apiKey) {
      throw new Error('API key is required')
    }

    // Use provided coordinates or geocode the address
    let lat = latitude;
    let lng = longitude;
    
    if (!lat || !lng) {
      const coordinates = await geocodeAddress(address, apiKey);
      lat = coordinates.lat;
      lng = coordinates.lng;
    }

    console.log(`Using coordinates: ${lat}, ${lng}`);
    
    // Determine which categories to fetch
    let categoriesToFetch = Object.keys(categoryConfigs);
    
    // If a specific category was requested, only fetch that one
    if (category) {
      if (categoryConfigs[category]) {
        console.log(`Fetching only category: ${category}`);
        categoriesToFetch = [category];
      } else {
        // For custom categories or types, we handle this in the fetchPlacesFromAPI function
        categoriesToFetch = [category];
      }
    }

    // Fetch places for each category
    const results = {};
    
    for (const categoryKey of categoriesToFetch) {
      console.log(`Fetching places for category ${categoryKey}`);
      
      try {
        const places = await fetchPlacesFromAPI(categoryKey, lat, lng, apiKey, radius);
        results[categoryKey] = places;
        
        // Also add to specific type keys for backward compatibility
        if (categoryKey in categoryConfigs) {
          const config = categoryConfigs[categoryKey];
          for (const type of config.includedTypes) {
            const placesOfType = places.filter(p => 
              p.type === type || (p.types && p.types.includes(type))
            );
            if (placesOfType.length > 0) {
              results[type] = placesOfType;
            }
          }
        }
      } catch (error) {
        console.error(`Error processing category ${categoryKey}:`, error);
        results[categoryKey] = [];
      }
    }

    // Update the property with the new data if propertyId is provided and this is a full fetch
    if (propertyId && !category) {
      // Flatten all results into a single array
      const allPlaces = Object.values(results).flat();
      
      try {
        await updatePropertyWithPlaces(propertyId, lat, lng, allPlaces);
      } catch (error) {
        console.error('Error updating property:', error);
        // Continue anyway to return the results to the client
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
