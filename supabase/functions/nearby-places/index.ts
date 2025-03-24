
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './constants.ts'
import { geocodeAddress } from './geocoding.ts'
import { fetchPlacesFromAPI } from './places-api.ts'
import { updatePropertyWithPlaces } from './utils.ts'
import { categoryConfigs } from './constants.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log(`Nearby places function called with method: ${req.method}`);
    
    const requestData = await req.json();
    console.log("Request received with data:", {
      address: requestData.address,
      hasApiKey: !!requestData.apiKey,
      category: requestData.category,
      hasCoordinates: !!(requestData.latitude && requestData.longitude),
      radius: requestData.radius || 5000,
      propertyId: requestData.propertyId
    });
    
    // Log more detailed API key info for troubleshooting
    if (requestData.apiKey) {
      console.log(`API Key received: ${requestData.apiKey.substring(0, 5)}...${requestData.apiKey.substring(requestData.apiKey.length - 5)}`);
    } else {
      console.error("ERROR: No API key provided in request");
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const { 
      address, 
      apiKey, 
      category, 
      latitude, 
      longitude, 
      radius = 5000, 
      propertyId,
      supabaseUrl, 
      supabaseKey 
    } = requestData;
    
    if (!apiKey) {
      console.error('ERROR: API key is required but was not provided');
      throw new Error('API key is required')
    }

    // Use provided coordinates or geocode the address
    let lat = latitude;
    let lng = longitude;
    
    if (!lat || !lng) {
      console.log(`Geocoding address: ${address}`);
      try {
        const coordinates = await geocodeAddress(address, apiKey);
        lat = coordinates.lat;
        lng = coordinates.lng;
      } catch (error) {
        console.error("Geocoding error:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to geocode address' }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
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
        console.log(`Fetching only custom category/type: ${category}`);
        categoriesToFetch = [category];
      }
    }

    // Fetch places for each category
    const results = {};
    
    for (const categoryKey of categoriesToFetch) {
      console.log(`Fetching places for category ${categoryKey}`);
      
      try {
        const apiURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${categoryKey}&key=${apiKey}`;
        console.log(`API Request URL (partially redacted): https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${categoryKey}&key=API_KEY_REDACTED`);
        
        const places = await fetchPlacesFromAPI(categoryKey, lat, lng, apiKey, radius);
        console.log(`Retrieved ${places.length} places for category ${categoryKey}`);
        results[categoryKey] = places;
        
        // Also add to specific type keys for backward compatibility
        if (categoryKey in categoryConfigs) {
          const config = categoryConfigs[categoryKey];
          for (const type of config.includedTypes) {
            const placesOfType = places.filter(p => 
              p.type === type || (p.types && p.types.includes(type))
            );
            if (placesOfType.length > 0) {
              console.log(`Adding ${placesOfType.length} places of specific type ${type}`);
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
    if (propertyId && !category && supabaseUrl && supabaseKey) {
      // Flatten all results into a single array
      const allPlaces = Object.values(results).flat();
      console.log(`Total places retrieved across all categories: ${allPlaces.length}`);
      
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await updatePropertyWithPlaces(supabase, propertyId, lat, lng, allPlaces);
      } catch (error) {
        console.error('Error updating property:', error);
        // Continue anyway to return the results to the client
      }
    }

    // Count total places found
    let totalPlaces = 0;
    for (const categoryPlaces of Object.values(results)) {
      if (Array.isArray(categoryPlaces)) {
        totalPlaces += categoryPlaces.length;
      }
    }
    
    console.log(`Returning ${totalPlaces} total places across ${Object.keys(results).length} categories/types`);

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
    console.error('Error in nearby-places function:', error);
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
