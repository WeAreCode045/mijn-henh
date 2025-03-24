
import { corsHeaders } from './constants.ts';

// Geocode an address to get coordinates
export async function geocodeAddress(address: string, apiKey: string) {
  if (!address) {
    throw new Error('Address is required for geocoding');
  }
  
  const geocodeResponse = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );
  
  const geocodeData = await geocodeResponse.json();

  if (!geocodeData.results?.[0]?.geometry?.location) {
    throw new Error('Could not geocode address');
  }

  return {
    lat: geocodeData.results[0].geometry.location.lat,
    lng: geocodeData.results[0].geometry.location.lng
  };
}
