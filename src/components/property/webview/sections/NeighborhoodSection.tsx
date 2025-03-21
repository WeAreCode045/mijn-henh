
import { WebViewSectionProps } from "../types";
import { useRef, useEffect, useState } from "react";

export function NeighborhoodSection({ property, settings, waitForPlaces = false }: WebViewSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  // Filter places by visibility
  const visiblePlaces = property.nearby_places ? 
    property.nearby_places.filter(place => place.visible_in_webview !== false) : 
    [];

  // Group nearby places by category with improved categorization
  const groupedPlaces = visiblePlaces.length > 0 ? 
    visiblePlaces.reduce((acc: {[key: string]: any[]}, place) => {
      const category = place.type?.toLowerCase().includes('school') || place.type?.toLowerCase().includes('education') 
        ? 'education'
        : place.type?.toLowerCase().includes('gym') || place.type?.toLowerCase().includes('sport') ||
          place.type?.toLowerCase().includes('fitness') || place.type?.toLowerCase().includes('tennis') || 
          place.type?.toLowerCase().includes('soccer')
        ? 'sports'
        : place.type?.toLowerCase().includes('transit') || place.type?.toLowerCase().includes('station') || place.type?.toLowerCase().includes('bus')
        ? 'transportation'
        : place.type?.toLowerCase().includes('store') || place.type?.toLowerCase().includes('supermarket') || place.type?.toLowerCase().includes('mall')
        ? 'shopping'
        : 'other';
      
      if (!acc[category]) acc[category] = [];
      acc[category].push(place);
      return acc;
    }, {}) 
    : {};
  
  // Format transportation type
  const getTransportType = (place: any) => {
    if (place.type?.toLowerCase().includes('train') || place.type?.toLowerCase().includes('rail')) {
      return 'Train';
    } else if (place.type?.toLowerCase().includes('bus')) {
      return 'Bus';
    } else {
      return 'Transit';
    }
  };
  
  // Filter cities by visibility
  const visibleCities = property.nearby_cities ? 
    property.nearby_cities.filter(city => city.visible_in_webview !== false) : 
    [];

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6">
        <h3 className="text-xl font-semibold mb-4">Location & Nearby Places</h3>
        
        {property.location_description && (
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{property.location_description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map placeholder or actual map image */}
          <div className="h-[300px] rounded-lg overflow-hidden">
            {property.map_image ? (
              <img 
                src={property.map_image} 
                alt="Property location" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div ref={mapRef} className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">
                  Map loading... (requires Google Maps API)
                </p>
              </div>
            )}
          </div>
          
          {/* Address and Nearby Places */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-sm">
                {property.address}
              </p>
            </div>
            
            {Object.keys(groupedPlaces).length > 0 ? (
              <div>
                <h4 className="font-semibold mb-2">Nearby Places</h4>
                <div className="space-y-4">
                  {Object.entries(groupedPlaces).map(([category, places]) => (
                    <div key={category} className="space-y-1">
                      <h5 className="text-sm text-gray-500 font-medium capitalize">{category}</h5>
                      <ul className="space-y-1">
                        {places.map((place, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <svg 
                              className="w-4 h-4 mr-2 mt-0.5 text-green-500" 
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
                            <div>
                              <span className="font-medium">{place.name}</span>
                              {category === 'transportation' && (
                                <span className="ml-1 text-blue-600">({getTransportType(place)})</span>
                              )}
                              {place.rating && (
                                <span className="ml-1 text-yellow-600">★ {place.rating}</span>
                              )}
                              {place.distance && (
                                <span className="ml-1 text-gray-400">
                                  {typeof place.distance === 'number' 
                                    ? `(${place.distance} km)` 
                                    : `(${place.distance})`}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : waitForPlaces ? (
              <p className="text-sm text-gray-500 italic">
                Places data will be available in the printed version.
              </p>
            ) : null}
            
            {visibleCities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Nearby Cities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {visibleCities.map((city, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{city.name}</span>
                      <span className="ml-1 text-gray-500">({city.distance} km)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
