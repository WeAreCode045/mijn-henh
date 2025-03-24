
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
  // Find which category config to use
  let config;
  let includedTypes;
  
  if (categoryConfigs[category]) {
    config = categoryConfigs[category];
    includedTypes = config.includedTypes;
  } else {
    // Check if this is a specific type within a category
    let foundCategory = null;
    
    for (const [catKey, catConfig] of Object.entries(categoryConfigs)) {
      if (catConfig.includedTypes.includes(category)) {
        foundCategory = catKey;
        config = categoryConfigs[foundCategory];
        // Override the included types to be just the requested one
        includedTypes = [category];
        break;
      }
    }
    
    // If it's a completely custom type, create a single category for it
    if (!foundCategory) {
      config = {
        includedTypes: [category],
        maxResults: 20
      };
      includedTypes = [category];
    }
  }
  
  // Build request body
  const requestBody = buildPlacesRequestBody(
    includedTypes,
    config.maxResults,
    lat,
    lng,
    radius
  );
  
  console.log(`Request body for ${category}:`, JSON.stringify(requestBody));
  
  try {
    // Make request to Places API v1
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
    
    if (!placesData.places || !Array.isArray(placesData.places)) {
      console.log(`No places found for category ${category}:`, placesData);
      return [];
    }
    
    // Transform and sort the data
    const transformedPlaces = transformPlacesData(placesData.places, category, lat, lng);
    return sortPlacesByRating(transformedPlaces);
    
  } catch (error) {
    console.error(`Error fetching places for category ${category}:`, error);
    return [];
  }
}
