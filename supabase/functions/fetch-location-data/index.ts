
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

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
    const { address } = await req.json();

    if (!address) {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google Maps API key is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // First, get coordinates for the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
      throw new Error(`Geocoding failed: ${geocodeData.status}`);
    }

    const location = geocodeData.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;
    const formattedAddress = geocodeData.results[0].formatted_address;

    // Get static map image
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x300&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    // Fetch nearby places
    const nearbyPlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${GOOGLE_MAPS_API_KEY}`;
    const placesResponse = await fetch(nearbyPlacesUrl);
    const placesData = await placesResponse.json();

    let nearbyPlaces = [];
    if (placesData.status === "OK" && placesData.results) {
      nearbyPlaces = placesData.results.slice(0, 20).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type: place.types?.[0]?.replace('_', ' ') || "place",
        vicinity: place.vicinity,
        distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        icon: place.icon,
      }));
    }

    // Find nearby cities/localities
    const nearbyCitiesUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=locality|political&key=${GOOGLE_MAPS_API_KEY}`;
    const citiesResponse = await fetch(nearbyCitiesUrl);
    const citiesData = await citiesResponse.json();

    let nearbyCities = [];
    if (citiesData.status === "OK" && citiesData.results) {
      const mainCity = citiesData.results[0];
      nearbyCities.push({
        id: mainCity.place_id,
        name: mainCity.address_components.find((c: any) => c.types.includes("locality"))?.long_name || mainCity.formatted_address,
        distance: "0 km",
        lat: mainCity.geometry.location.lat,
        lng: mainCity.geometry.location.lng,
      });

      // Try to find a few more nearby cities
      const otherCitiesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=20000&type=locality&key=${GOOGLE_MAPS_API_KEY}`;
      const otherCitiesResponse = await fetch(otherCitiesUrl);
      const otherCitiesData = await otherCitiesResponse.json();

      if (otherCitiesData.status === "OK" && otherCitiesData.results) {
        const otherCities = otherCitiesData.results
          .filter((place: any) => place.place_id !== mainCity.place_id)
          .slice(0, 5)
          .map((place: any) => ({
            id: place.place_id,
            name: place.name,
            distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }));

        nearbyCities = [...nearbyCities, ...otherCities];
      }
    }

    return new Response(
      JSON.stringify({
        latitude,
        longitude,
        formatted_address: formattedAddress,
        map_image: mapImageUrl,
        nearby_places: nearbyPlaces,
        nearby_cities: nearbyCities,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-location-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Calculate distance in km between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
