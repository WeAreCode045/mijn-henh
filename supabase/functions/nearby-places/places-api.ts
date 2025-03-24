
import { transformPlacesData, sortPlacesByRating, buildPlacesRequestBody } from './utils.ts';
import { categoryConfigs } from './constants.ts';

// Fetch places from Google Places API
export async function fetchPlacesFromAPI(
  category: string, 
  lat: number, 
  lng: number, 
  apiKey: string,
  radius: number = 5000
) {
  console.log(`Fetching places API for category: ${category}, coordinates: ${lat},${lng}, radius: ${radius}m`);
  
  // Find which category config to use
  let config;
  let includedTypes;
  
  if (categoryConfigs[category]) {
    config = categoryConfigs[category];
    includedTypes = config.includedTypes;
    console.log(`Using predefined category config for ${category} with types:`, includedTypes);
  } else {
    // Check if this is a specific type within a category
    let foundCategory = null;
    
    for (const [catKey, catConfig] of Object.entries(categoryConfigs)) {
      if (catConfig.includedTypes.includes(category)) {
        foundCategory = catKey;
        config = categoryConfigs[foundCategory];
        // Override the included types to be just the requested one
        includedTypes = [category];
        console.log(`Found ${category} as type within category ${foundCategory}`);
        break;
      }
    }
    
    // If it's a completely custom type, create a single category for it
    if (!foundCategory) {
      console.log(`Using custom type for ${category}`);
      config = {
        includedTypes: [category],
        maxResults: 20
      };
      includedTypes = [category];
    }
  }
  
  // Use the classic Places API for backward compatibility with the most common types
  try {
    console.log(`Making classic API request for ${category}`);
    const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${category}&key=${apiKey}`;
    
    const placesResponse = await fetch(placesApiUrl);
    
    const responseStatus = placesResponse.status;
    console.log(`Classic Places API response status: ${responseStatus}`);
    
    if (responseStatus !== 200) {
      throw new Error(`Places API returned status ${responseStatus}`);
    }
    
    const placesData = await placesResponse.json();
    
    if (!placesData.results || !Array.isArray(placesData.results)) {
      console.log(`No results found from classic API for ${category}:`, placesData);
      throw new Error('No results returned from Places API');
    }
    
    console.log(`Found ${placesData.results.length} places from classic API for ${category}`);
    
    const transformedPlaces = placesData.results.map(place => ({
      id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating || null,
      user_ratings_total: place.user_ratings_total || 0,
      type: category,
      types: place.types || [],
      visible_in_webview: true,
      distance: null, // Distance is calculated later if needed
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null
    }));
    
    return sortPlacesByRating(transformedPlaces);
  } catch (error) {
    console.error(`Error with classic Places API for ${category}:`, error);
    
    // Try Places API v1 as fallback
    try {
      // Build request body
      const requestBody = buildPlacesRequestBody(
        includedTypes,
        config.maxResults,
        lat,
        lng,
        radius
      );
      
      console.log(`Request body for ${category}:`, JSON.stringify(requestBody));
      
      // Log the full API URL being called
      const placesApiUrl = 'https://places.googleapis.com/v1/places:searchNearby';
      console.log(`Making fallback API request to Places API v1: ${placesApiUrl}`);
      
      // Make request to Places API v1
      const placesResponse = await fetch(
        placesApiUrl,
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
      
      const responseStatus = placesResponse.status;
      const responseText = await placesResponse.text();
      
      console.log(`Places API v1 response status: ${responseStatus}`);
      console.log(`Places API v1 response for ${category}:`, responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
      
      let placesData;
      try {
        placesData = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`Error parsing Places API response: ${parseError.message}`);
        return [];
      }
      
      if (!placesData.places || !Array.isArray(placesData.places)) {
        console.log(`No places found from v1 API for category ${category}:`, placesData);
        if (placesData.error) {
          console.error(`API error for ${category}:`, placesData.error);
        }
        return [];
      }
      
      console.log(`Found ${placesData.places.length} places from v1 API for category ${category}`);
      
      // Transform and sort the data
      const transformedPlaces = transformPlacesData(placesData.places, category, lat, lng);
      return sortPlacesByRating(transformedPlaces);
      
    } catch (fallbackError) {
      console.error(`Error with fallback Places API for ${category}:`, fallbackError);
      return [];
    }
  }
}
