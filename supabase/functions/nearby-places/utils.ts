// Helper function to calculate distance between two coordinates in kilometers
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Transform places data from Google Places API to our application format
export function transformPlacesData(places: any[], category: string, lat: number, lng: number) {
  console.log(`Transforming ${places.length} places for category ${category}`);
  
  return places.map(place => {
    // Calculate distance from property to this place
    let distance = null;
    if (place.location && place.location.latitude && place.location.longitude) {
      distance = calculateDistance(
        lat, 
        lng, 
        place.location.latitude, 
        place.location.longitude
      );
    }
    
    const transformedPlace = {
      id: place.id,
      name: place.displayName?.text || 'Unknown Place',
      vicinity: place.formattedAddress || '',
      rating: place.rating || null,
      user_ratings_total: place.userRatingCount || 0,
      type: place.primaryType || category,
      types: place.types || [category],
      visible_in_webview: true,
      distance: distance,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude
    };
    
    console.log(`Transformed place: ${transformedPlace.name}, type: ${transformedPlace.type}, distance: ${transformedPlace.distance}`);
    return transformedPlace;
  });
}

// Sort places by rating (descending) with null ratings at the end
export function sortPlacesByRating(places: any[]) {
  return places.sort((a, b) => {
    // If either rating is null, sort it last
    if (a.rating === null) return 1;
    if (b.rating === null) return -1;
    
    // Otherwise sort by rating (higher first)
    return b.rating - a.rating;
  });
}

// Build the request body for Places API
export function buildPlacesRequestBody(
  includedTypes: string[],
  maxResults: number,
  lat: number,
  lng: number,
  radius: number
) {
  // Construct request body according to Places API v1 specification
  const requestBody = {
    includedTypes: includedTypes,
    maxResultCount: maxResults,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng
        },
        radius: radius
      }
    }
  };
  
  console.log(`Built request body with types: ${JSON.stringify(includedTypes)}, maxResults: ${maxResults}, lat: ${lat}, lng: ${lng}, radius: ${radius}m`);
  
  return requestBody;
}

// Modify database directly to update property with places
export async function updatePropertyWithPlaces(supabaseClient: any, propertyId: string, lat: number, lng: number, places: any[]) {
  console.log(`Updating property ${propertyId} with ${places.length} places`);
  
  try {
    // Only update places and coordinates
    const { error } = await supabaseClient
      .from('properties')
      .update({
        nearby_places: places,
        latitude: lat,
        longitude: lng
      })
      .eq('id', propertyId);
      
    if (error) {
      console.error('Error updating property:', error);
      throw error;
    }
    
    console.log(`Successfully updated property ${propertyId} with ${places.length} places`);
    return true;
  } catch (error) {
    console.error('Error in updatePropertyWithPlaces:', error);
    throw error;
  }
}
