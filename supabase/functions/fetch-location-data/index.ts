
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const requestData = await req.json();
    const { address, propertyId, category, citiesOnly, coordinatesOnly } = requestData;
    
    if (!address) {
      throw new Error("Address is required");
    }

    // Get settings from database to retrieve API keys
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("agency_settings")
      .select("google_maps_api_key")
      .single();

    if (settingsError) {
      throw new Error(`Failed to retrieve settings: ${settingsError.message}`);
    }

    if (!settings.google_maps_api_key) {
      throw new Error("Google Maps API key is not configured");
    }

    const googleMapsApiKey = settings.google_maps_api_key;
    
    // First, get coordinates from the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results?.[0]?.geometry?.location) {
      throw new Error("Could not geocode address");
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    console.log(`Geocoded coordinates: ${lat}, ${lng}`);

    // Generate static map image URL
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${googleMapsApiKey}`;
    console.log(`Generated map image URL`);

    // If coordinatesOnly is specified, just return the coordinates
    if (coordinatesOnly) {
      // Update the property with coordinates if propertyId is provided
      if (propertyId) {
        const { error: updateError } = await supabaseAdmin
          .from("properties")
          .update({
            latitude: lat,
            longitude: lng
          })
          .eq("id", propertyId);

        if (updateError) {
          throw new Error(`Failed to update property: ${updateError.message}`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          latitude: lat,
          longitude: lng
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If category is specified, just fetch places for that category
    if (category) {
      let placeType = category;
      
      // Map our category names to Google Place types
      const categoryMap: Record<string, string> = {
        "restaurant": "restaurant",
        "education": "school",
        "supermarket": "supermarket",
        "shopping": "shopping_mall",
        "sport": "gym",
        "leisure": "park"
      };
      
      if (categoryMap[category]) {
        placeType = categoryMap[category];
      }
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${placeType}&key=${googleMapsApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const places = data.results?.map((place: any) => {
        // Calculate distance from property to place (in km)
        const distance = calculateDistance(lat, lng, 
          place.geometry.location.lat, 
          place.geometry.location.lng);
          
        return {
          place_id: place.place_id,
          name: place.name,
          type: category,
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          distance: parseFloat(distance.toFixed(1)),
          visible_in_webview: true
        };
      }) || [];
      
      const result = { [category]: places };
      
      return new Response(
        JSON.stringify(result),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // For cities only request
    if (citiesOnly) {
      // Fetch nearby cities with population data 
      const citiesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=200000&type=locality&key=${googleMapsApiKey}&rankby=prominence`;
      const citiesResponse = await fetch(citiesUrl);
      const citiesData = await citiesResponse.json();
      
      let cities = [];
      if (citiesData.results && citiesData.results.length > 0) {
        cities = citiesData.results.slice(0, 5).map((city: any) => {
          // Calculate distance from property to city (in km)
          const cityLat = city.geometry.location.lat;
          const cityLng = city.geometry.location.lng;
          const distance = calculateDistance(lat, lng, cityLat, cityLng);
          
          return {
            id: city.place_id,
            name: city.name,
            distance: parseFloat(distance.toFixed(1)),
            vicinity: city.vicinity,
            visible_in_webview: true
          };
        });
      }
      
      return new Response(
        JSON.stringify({ cities }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch nearby places for all categories
    const nearbyPlacesTypes = {
      "restaurant": "restaurant",
      "education": "school",
      "supermarket": "supermarket", 
      "shopping": "shopping_mall",
      "sport": "gym",
      "leisure": "park",
      "transportation": "transit_station"
    };
    
    const placePromises = Object.entries(nearbyPlacesTypes).map(async ([category, type]) => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${googleMapsApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return data.results?.map((place: any) => {
        // Calculate distance from property to place (in km)
        const distance = calculateDistance(lat, lng, 
          place.geometry.location.lat, 
          place.geometry.location.lng);
          
        return {
          id: place.place_id,
          name: place.name,
          type: category,
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          distance: parseFloat(distance.toFixed(1)),
          visible_in_webview: true
        };
      }) || [];
    });

    const placesResults = await Promise.all(placePromises);
    const nearbyPlaces = placesResults.flat();
    console.log(`Fetched ${nearbyPlaces.length} nearby places`);

    // Fetch nearby cities (top 5 by population, max 200km)
    let nearbyCities = [];
    try {
      // Fetch nearby cities with population data 
      const citiesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=200000&type=locality&key=${googleMapsApiKey}&rankby=prominence`;
      const citiesResponse = await fetch(citiesUrl);
      const citiesData = await citiesResponse.json();
      
      if (citiesData.results && citiesData.results.length > 0) {
        const cities = citiesData.results.slice(0, 5).map((city: any) => {
          // Calculate distance from property to city (in km)
          const cityLat = city.geometry.location.lat;
          const cityLng = city.geometry.location.lng;
          const distance = calculateDistance(lat, lng, cityLat, cityLng);
          
          return {
            id: city.place_id,
            name: city.name,
            distance: parseFloat(distance.toFixed(1)),
            vicinity: city.vicinity,
            visible_in_webview: true
          };
        });
        
        nearbyCities = cities;
      }
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
    }

    // Update the property with the new data if propertyId is provided
    if (propertyId) {
      const { error: updateError } = await supabaseAdmin
        .from("properties")
        .update({
          latitude: lat,
          longitude: lng,
          map_image: mapImageUrl,
          nearby_places: nearbyPlaces,
          nearby_cities: nearbyCities
        })
        .eq("id", propertyId);

      if (updateError) {
        throw new Error(`Failed to update property: ${updateError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        latitude: lat,
        longitude: lng,
        map_image: mapImageUrl,
        nearby_places: nearbyPlaces,
        nearby_cities: nearbyCities
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
