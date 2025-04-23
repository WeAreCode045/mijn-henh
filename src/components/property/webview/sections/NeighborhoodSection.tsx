
import { useEffect, useState } from "react";
import { WebViewSectionProps } from "../types";
import { MapPin, Loader } from "lucide-react";
import "../styles/WebViewStyles.css";

interface NeighborhoodSectionProps extends WebViewSectionProps {
  waitForPlaces?: boolean;
}

export function NeighborhoodSection({ 
  property, 
  settings, 
  waitForPlaces = false 
}: NeighborhoodSectionProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Generate map URL based on coordinates
  const mapUrl = property.latitude && property.longitude
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${property.latitude},${property.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${property.latitude},${property.longitude}&key=${settings?.googleMapsApiKey || ''}`
    : null;
  
  useEffect(() => {
    if (mapUrl) {
      const image = new Image();
      image.onload = () => setIsMapLoaded(true);
      image.src = mapUrl;
    }
  }, [mapUrl]);

  // Group nearby places by type/category for better organization
  const groupedPlaces = property.nearby_places ? 
    property.nearby_places.reduce((acc, place) => {
      // Use type as the primary category identifier, with fallback to avoid TypeScript errors
      const category = place.type || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(place);
      return acc;
    }, {} as Record<string, any[]>) : {};
  
  const hasNearbyPlaces = property.nearby_places && property.nearby_places.length > 0;
  
  console.log("Property nearby places:", property.nearby_places);
  console.log("Grouped places:", groupedPlaces);
  
  return (
    <div className="space-y-6 px-6">
      <h2 
        className="text-2xl font-bold" 
        style={{ color: settings?.secondaryColor }}
      >
        Neighborhood
      </h2>
      
      {/* Location Description */}
      {property.location_description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">About the Area</h3>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
            {property.location_description}
          </p>
        </div>
      )}
      
      {/* Map Section */}
      <div className="w-full">
        {mapUrl ? (
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={mapUrl}
              alt="Property location"
              className="w-full h-auto"
              style={{ opacity: isMapLoaded ? 1 : 0.3 }}
            />
            {!isMapLoaded && (
              <div className="flex items-center justify-center h-[300px] bg-gray-100">
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-100 p-8 flex flex-col items-center justify-center text-center">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No location coordinates available</p>
          </div>
        )}
      </div>
      
      {/* Address */}
      <div className="flex items-start space-x-2 mt-4">
        <MapPin className="h-5 w-5 text-gray-700 mt-0.5" />
        <div>
          <h3 className="font-semibold">Address</h3>
          <p className="text-gray-700">
            {property.address || "Address not provided"}
          </p>
        </div>
      </div>
      
      {/* Nearby Places Section */}
      {hasNearbyPlaces && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Nearby Places</h3>
          
          {Object.entries(groupedPlaces).map(([category, places]) => (
            <div key={category} className="mb-6">
              <h4 className="font-medium text-base mb-2 capitalize">{category}</h4>
              <div className="space-y-2">
                {places.map((place, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>{place.name}</span>
                    {place.distance && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {typeof place.distance === 'number' 
                          ? `${place.distance.toFixed(1)} km` 
                          : place.distance}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
