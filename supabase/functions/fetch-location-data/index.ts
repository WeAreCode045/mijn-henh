
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
    const { address, propertyId } = await req.json();
    
    if (!address) {
      throw new Error("Address is required");
    }

    if (!propertyId) {
      throw new Error("Property ID is required");
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

    // Fetch nearby places
    const nearbyPlacesTypes = [
      "restaurant", "school", "supermarket", "shopping_mall", 
      "gym", "park", "hospital", "transit_station"
    ];
    
    const placePromises = nearbyPlacesTypes.map(async (type) => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${googleMapsApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.results?.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type: type,
        vicinity: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        visible_in_webview: true
      })) || [];
    });

    const placesResults = await Promise.all(placePromises);
    const nearbyPlaces = placesResults.flat();
    console.log(`Fetched ${nearbyPlaces.length} nearby places`);

    // Update the property with the new data
    const { error: updateError } = await supabaseAdmin
      .from("properties")
      .update({
        latitude: lat,
        longitude: lng,
        map_image: mapImageUrl,
        nearby_places: nearbyPlaces,
      })
      .eq("id", propertyId);

    if (updateError) {
      throw new Error(`Failed to update property: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        latitude: lat,
        longitude: lng,
        map_image: mapImageUrl,
        nearby_places: nearbyPlaces,
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
