
import { WebViewSectionProps } from "../types";
import { PropertyNearbyPlace } from "@/types/property";

export function NeighborhoodSection({ property, settings, waitForPlaces = false }: WebViewSectionProps) {
  // Get nearby places, ensuring it's always an array
  const nearbyPlaces = property.nearbyPlaces ? 
    (Array.isArray(property.nearbyPlaces) ? property.nearbyPlaces : [property.nearbyPlaces]) 
    : [];
  
  console.log("Nearby places:", nearbyPlaces);
  
  // Group places by category
  const placesByCategory = nearbyPlaces.reduce((acc, place) => {
    const category = place.type || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);
  
  // Format a place's distance for display
  const formatDistance = (distance?: number): string => {
    if (distance === undefined || distance === null) return "";
    
    // Format based on distance
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    
    return `${distance.toFixed(1)} km`;
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="px-6">
        {/* Property Location Map */}
        <div className="mb-6 rounded-lg overflow-hidden shadow-md">
          {property.location ? (
            <iframe
              src={`https://maps.google.com/maps?q=${property.location.lat},${property.location.lng}&z=15&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="bg-gray-100 h-[400px] flex items-center justify-center">
              <p className="text-gray-400">No location data available</p>
            </div>
          )}
        </div>
        
        {/* Property Location Address */}
        <div className="mb-6 bg-white/90 p-4 rounded-lg shadow-sm">
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: settings?.secondaryColor }}
          >
            Address
          </h3>
          <p className="text-gray-600">
            {property.address || "Address not available"}
          </p>
          
          {/* Location Description (if available) */}
          {property.locationDescription && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-1">About this location</h4>
              <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                {property.locationDescription}
              </p>
            </div>
          )}
        </div>
        
        {/* Nearby Places */}
        {Object.entries(placesByCategory).length > 0 && (
          <div className="bg-white/90 p-4 rounded-lg shadow-sm">
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: settings?.secondaryColor }}
            >
              Nearby Places
            </h3>
            
            {Object.entries(placesByCategory).map(([category, places]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h4 className="text-md font-medium mb-2 border-b pb-1">
                  {category}
                </h4>
                
                <ul className="space-y-2">
                  {places.map((place, index) => (
                    <li 
                      key={place.id || `place-${category}-${index}`}
                      className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 rounded-md border-b border-gray-100"
                    >
                      <span className="flex-1">{place.name}</span>
                      <span className="text-gray-500 text-sm">
                        {formatDistance(place.distance)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {Object.entries(placesByCategory).length === 0 && !waitForPlaces && (
          <div className="bg-white/90 p-4 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">No nearby places found</p>
          </div>
        )}
        
        {waitForPlaces && Object.entries(placesByCategory).length === 0 && (
          <div className="bg-white/90 p-4 rounded-lg shadow-sm text-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mt-4">Loading nearby places...</p>
          </div>
        )}
      </div>
    </div>
  );
}
