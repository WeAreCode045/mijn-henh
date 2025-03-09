
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { address, apiKey, propertyId, openaiApiKey } = await req.json();

    if (!address || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Address and API key are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Fetching location data for address:", address);

    // Step 1: Geocode the address to get lat/lng
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
      throw new Error(`Geocoding failed: ${geocodeData.status}`);
    }

    const location = geocodeData.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    console.log("Location coordinates:", latitude, longitude);

    // Step 2: Generate a static map image
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${apiKey}`;

    // Step 3: Fetch nearby places
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${apiKey}`;
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    const nearbyPlaces = placesData.results
      .filter((place: any) => place.types && place.types.length > 0)
      .map((place: any) => {
        // Calculate distance (simplified)
        const plat = place.geometry.location.lat;
        const plng = place.geometry.location.lng;
        const distance = calculateDistance(latitude, longitude, plat, plng);
        
        // Get a readable place type
        const placeType = getReadablePlaceType(place.types[0]);

        return {
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          type: placeType,
          distance: `${distance.toFixed(1)} km`, // Format distance
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          visible_in_webview: true // Default to visible
        };
      });

    // Step 4: Fetch nearby cities (if available)
    const nearbyCities: any[] = [];
    try {
      const cities = await getNearestCities(latitude, longitude, apiKey);
      cities.forEach(city => {
        nearbyCities.push({
          id: `city-${nearbyCities.length + 1}`,
          name: city.name,
          distance: `${city.distance.toFixed(1)} km`,
          visible_in_webview: true
        });
      });
    } catch (error) {
      console.warn("Error fetching nearby cities:", error);
    }

    // Step 5: Generate a location description (if OpenAI key is provided)
    let locationDescription = undefined;
    if (openaiApiKey) {
      try {
        const prompt = `Write a concise but comprehensive location description for a property at "${address}".
        Focus on the neighborhood, accessibility, lifestyle, and nearby amenities.
        The description should be appealing to potential property buyers/renters.
        Limit the response to 3-4 paragraphs maximum. Write in a professional real estate style.`;

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a professional real estate copywriter specializing in location descriptions."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
          }),
        });

        const openaiData = await openaiResponse.json();
        locationDescription = openaiData.choices?.[0]?.message?.content.trim();
      } catch (error) {
        console.warn("Error generating location description:", error);
      }
    }

    // Return all the data
    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          latitude,
          longitude,
          mapImage: mapImageUrl,
          nearbyPlaces,
          nearbyCities,
          locationDescription
        },
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

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Radius of the Earth in kilometers
  const R = 6371;
  
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Helper function to get more readable place types
function getReadablePlaceType(type: string): string {
  const typeMap: Record<string, string> = {
    "restaurant": "Restaurant",
    "cafe": "Café",
    "bar": "Bar",
    "supermarket": "Supermarket",
    "grocery_or_supermarket": "Grocery Store",
    "school": "School",
    "university": "University",
    "shopping_mall": "Shopping Mall",
    "park": "Park",
    "hospital": "Hospital",
    "pharmacy": "Pharmacy",
    "gym": "Gym",
    "transit_station": "Transit Station",
    "subway_station": "Subway Station",
    "bus_station": "Bus Station",
    "train_station": "Train Station",
    "bakery": "Bakery",
    "bank": "Bank",
    "post_office": "Post Office",
    "library": "Library",
    "movie_theater": "Cinema",
    "museum": "Museum",
    "tourist_attraction": "Tourist Attraction",
    "lodging": "Hotel",
    "convenience_store": "Convenience Store",
    "gas_station": "Gas Station",
    "doctor": "Doctor's Office",
    "dentist": "Dentist",
    "police": "Police Station",
    "fire_station": "Fire Station",
    "church": "Church",
    "mosque": "Mosque",
    "synagogue": "Synagogue",
    "hindu_temple": "Hindu Temple",
    "airport": "Airport",
    "amusement_park": "Amusement Park",
    "aquarium": "Aquarium",
    "art_gallery": "Art Gallery",
    "zoo": "Zoo",
    "stadium": "Stadium",
    "beach": "Beach",
    "campground": "Campground",
    "spa": "Spa",
    "cemetery": "Cemetery",
    "courthouse": "Courthouse",
    "embassy": "Embassy",
    "liquor_store": "Liquor Store",
    "night_club": "Night Club",
    "parking": "Parking",
    "veterinary_care": "Veterinarian",
    "place_of_worship": "Place of Worship",
  };

  return typeMap[type] || type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Helper function to fetch nearby cities (simplified version)
async function getNearestCities(lat: number, lng: number, apiKey: string) {
  // This is a simplified approach to get cities
  // Normally, you would need a more comprehensive API for this
  try {
    const radius = 30000; // 30km
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=locality&key=${apiKey}`;
    
    const response = await fetch(placesUrl);
    const data = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`City search failed: ${data.status}`);
    }
    
    return data.results
      .filter((place: any) => place.types && place.types.includes("locality"))
      .map((place: any) => {
        const placeLat = place.geometry.location.lat;
        const placeLng = place.geometry.location.lng;
        const distance = calculateDistance(lat, lng, placeLat, placeLng);
        
        return {
          name: place.name,
          distance: distance
        };
      })
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 5); // Take top 5 closest cities
  } catch (error) {
    console.error("Error getting nearby cities:", error);
    return [];
  }
}
