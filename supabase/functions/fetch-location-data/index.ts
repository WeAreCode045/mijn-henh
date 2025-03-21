
// Use standard ES import syntax for Deno functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
    },
  }
);

// Handle the request
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, apiKey, propertyId, coordinatesOnly, generateMap, category } = await req.json();

    // Validation
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing request for address: ${address}`);
    console.log(`Parameters: coordinatesOnly=${coordinatesOnly}, generateMap=${generateMap}, category=${category}`);

    // Get API key from request or from secrets
    let googleMapsApiKey = apiKey;
    if (!googleMapsApiKey) {
      const { data, error } = await supabaseAdmin
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();

      if (error) throw error;
      googleMapsApiKey = data?.google_maps_api_key;
    }

    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key is required but not found');
    }

    // Geocode the address to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      console.error('Geocoding error:', geocodeData);
      throw new Error(`Geocoding failed: ${geocodeData.status}`);
    }

    const location = geocodeData.results[0].geometry.location;
    const { lat, lng } = location;

    console.log(`Geocoded coordinates: lat=${lat}, lng=${lng}`);

    // Early return if we only need coordinates
    if (coordinatesOnly === true) {
      // Update property with coords only
      if (propertyId) {
        await supabaseAdmin
          .from('properties')
          .update({ latitude: lat, longitude: lng })
          .eq('id', propertyId);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          latitude: lat, 
          longitude: lng 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle map image generation if requested
    let mapImageUrl = null;
    if (generateMap) {
      console.log("Generating map image");
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${googleMapsApiKey}`;
      
      try {
        // Generate a unique filename
        const imageFileName = `map_${propertyId}_${Date.now()}.png`;
        
        // Fetch the image
        const mapResponse = await fetch(staticMapUrl);
        const mapImageBlob = await mapResponse.blob();
        
        // Upload to Supabase Storage
        const { data: storageData, error: storageError } = await supabaseAdmin
          .storage
          .from('property_images')
          .upload(`maps/${imageFileName}`, mapImageBlob, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (storageError) throw storageError;
        
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('property_images')
          .getPublicUrl(`maps/${imageFileName}`);
          
        mapImageUrl = publicUrl;
        
        // Update property with map image URL
        if (propertyId) {
          await supabaseAdmin
            .from('properties')
            .update({ map_image: mapImageUrl })
            .eq('id', propertyId);
        }
        
        console.log("Map image generated and uploaded:", mapImageUrl);
      } catch (error) {
        console.error("Error generating map image:", error);
        // Continue without map if it fails
      }
    }

    // If a specific category is requested, only fetch places for that category
    if (category) {
      console.log(`Fetching places for category: ${category}`);

      // Define radius based on category (in meters)
      let radius = 1500; // Default radius
      if (category === 'school' || category.includes('school') || category === 'university') {
        radius = 2000; // Schools need a wider radius
      } else if (category === 'shopping_mall') {
        radius = 3000; // Shopping malls can be further away
      }

      // Prepare the places API URL
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${category}&key=${googleMapsApiKey}`;
      
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();

      if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
        console.error('Places API error:', placesData);
        throw new Error(`Places API failed: ${placesData.status}`);
      }

      // Process and return only the category requested
      const places = placesData.results || [];
      
      // Calculate distance from property to each place
      const placesWithDistance = places.map(place => {
        const placeLocation = place.geometry.location;
        const distance = calculateDistance(lat, lng, placeLocation.lat, placeLocation.lng);
        return {
          ...place,
          distance: parseFloat(distance.toFixed(1))
        };
      });

      // Sort by distance or rating depending on category
      let sortedPlaces = placesWithDistance;
      if (category === 'entertainment') {
        // For entertainment, sort by rating (highest first)
        sortedPlaces = placesWithDistance.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        // For others, sort by distance (closest first)
        sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
      }

      // Only return required data
      const formattedPlaces = sortedPlaces.map(place => ({
        place_id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        types: place.types,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        distance: place.distance
      }));

      const result = {
        success: true,
        latitude: lat,
        longitude: lng,
        [category]: formattedPlaces
      };

      if (mapImageUrl) {
        result.map_image = mapImageUrl;
      }

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no specific category, fetch all important places
    const types = [
      'restaurant',
      'supermarket',
      'school',
      'park',
      'shopping_mall',
      'bus_station',
      'train_station',
      'transit_station'
    ];

    const nearbyPlaces = {};
    for (const type of types) {
      console.log(`Fetching places for type: ${type}`);

      // Define radius based on type (in meters)
      let radius = 1500; // Default radius
      if (type === 'school' || type.includes('school')) {
        radius = 2000; // Schools need a wider radius
      } else if (type === 'shopping_mall') {
        radius = 3000; // Shopping malls can be further away
      }

      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${googleMapsApiKey}`;
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();

      if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
        console.error('Places API error:', placesData);
        throw new Error(`Places API failed: ${placesData.status}`);
      }

      const places = placesData.results || [];
      nearbyPlaces[type] = places.map(place => ({
        place_id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        types: place.types,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      }));
    }

    // Success response with all data
    return new Response(
      JSON.stringify({
        success: true,
        latitude: lat,
        longitude: lng,
        nearby_places: nearbyPlaces,
        map_image: mapImageUrl
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to calculate distance between two points (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
