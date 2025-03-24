
// Function to calculate distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Transform places data to our expected format
export function transformPlacesData(places: any[], category: string, userLat: number, userLng: number) {
  return places.map(place => {
    // Calculate distance using the Haversine formula
    const distance = place.location?.latitude && place.location?.longitude
      ? calculateDistance(
          userLat, 
          userLng, 
          place.location.latitude, 
          place.location.longitude
        )
      : null;
    
    return {
      id: place.id,
      name: place.displayName?.text || 'Unknown Place',
      vicinity: place.formattedAddress || '',
      rating: place.rating || null, // Use null instead of 0 for missing ratings
      user_ratings_total: place.userRatingCount || 0,
      type: place.primaryType || category,
      types: place.types || [],
      distance: distance !== null ? parseFloat(distance.toFixed(2)) : "nearby",
      visible_in_webview: true,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude
    };
  });
}

// Sort places by rating
export function sortPlacesByRating(places: any[]) {
  return [...places].sort((a, b) => {
    if (a.rating === null && b.rating === null) return 0;
    if (a.rating === null) return 1;
    if (b.rating === null) return -1;
    return b.rating - a.rating;
  });
}

// Build the request body for Places API
export function buildPlacesRequestBody(includedTypes: string[], maxResults: number, lat: number, lng: number, radius: number) {
  return {
    "includedTypes": includedTypes,
    "maxResultCount": maxResults,
    "locationRestriction": {
      "circle": {
        "center": {
          "latitude": lat,
          "longitude": lng
        },
        "radius": radius
      }
    }
  };
}
