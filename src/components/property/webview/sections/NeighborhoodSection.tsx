
import { WebViewSectionProps } from "../types";
import { useRef, useEffect, useState } from "react";

export function NeighborhoodSection({ property, settings, waitForPlaces = false }: WebViewSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [places, setPlaces] = useState<{ name: string; category: string; distance: string }[]>([]);

  useEffect(() => {
    // Simplified function to handle map loading
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Just mark as loaded for now
      setMapLoaded(true);
      
      console.log("Map would be initialized here with coordinates:", property.latitude, property.longitude);
      
      // In a real implementation, we would initialize the Google Maps here
      // but for now we'll just show a placeholder
    };

    // Try to initialize the map (in a real implementation we would check for Google Maps API)
    initMap();

    return () => {
      // Cleanup would happen here
    };
  }, [property.latitude, property.longitude, waitForPlaces]);

  // Mock data for nearby places since we can't use Google Maps API
  const mockPlaces = [
    { name: "Local Elementary School", category: "Education", distance: "0.5 km" },
    { name: "Downtown Restaurant", category: "Dining", distance: "1.2 km" },
    { name: "Central Park", category: "Recreation", distance: "0.8 km" },
    { name: "Community Hospital", category: "Healthcare", distance: "2.3 km" },
    { name: "Metro Station", category: "Transportation", distance: "0.3 km" },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6">
        <h3 className="text-xl font-semibold mb-4">Location & Nearby Places</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map placeholder */}
          <div className="h-[300px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            <div ref={mapRef} className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">
                Map loading... (requires Google Maps API)
              </p>
            </div>
          </div>
          
          {/* Address and Nearby Places */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-sm">
                {property.address}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Nearby Places</h4>
              {waitForPlaces ? (
                <p className="text-sm text-gray-500 italic">
                  Places data will be available in the printed version.
                </p>
              ) : (
                <ul className="space-y-2">
                  {mockPlaces.map((place, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <svg 
                        className="w-4 h-4 mr-2 mt-0.5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="font-medium">{place.name}</span>
                      <span className="mx-1 text-gray-500">•</span>
                      <span className="text-gray-500">{place.category}</span>
                      {place.distance && (
                        <>
                          <span className="mx-1 text-gray-500">•</span>
                          <span className="text-gray-500">{place.distance}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
