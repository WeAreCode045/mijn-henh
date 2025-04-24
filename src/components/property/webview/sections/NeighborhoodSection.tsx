
import { useRef, useEffect, useState } from "react";
import { WebViewSectionProps } from "../types";
import { PropertyNearbyPlace } from "@/types/property";

export function NeighborhoodSection({ property, settings, waitForPlaces = false }: WebViewSectionProps) {
  const primaryColor = settings?.primaryColor || '#1a365d';
  const secondaryColor = settings?.secondaryColor || '#3182ce';
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  // Update map height when description height changes
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height && height !== descriptionHeight) {
        setDescriptionHeight(height);
      }
    });

    if (descriptionRef.current) {
      resizeObserver.observe(descriptionRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [descriptionHeight]);
  // Get nearby places, ensuring it's always an array
  const nearbyPlaces = property.nearby_places ? 
    (Array.isArray(property.nearby_places) ? property.nearby_places : [property.nearby_places]) 
    : [];
  
  console.log("Nearby places:", nearbyPlaces);
  
  // Define main categories and their related types
  const categoryMapping: Record<string, string[]> = {
    'Food & Drinks': ['restaurant', 'cafe', 'bar', 'pub', 'food'],
    'Sports': ['gym', 'sports', 'fitness', 'swimming', 'tennis', 'football'],
    'Education': ['school', 'university', 'college', 'library', 'education'],
    'Shopping': ['shop', 'mall', 'supermarket', 'store', 'retail'],
    'Amusement': ['park', 'cinema', 'theater', 'museum', 'entertainment'],
  };

  // Group places by main category
  const placesByCategory = nearbyPlaces.reduce((acc, place) => {
    const type = (place.type || '').toLowerCase();
    let mainCategory = 'Other';

    // Find the main category for this place type
    for (const [category, types] of Object.entries(categoryMapping)) {
      if (types.some(t => type.includes(t))) {
        mainCategory = category;
        break;
      }
    }

    if (!acc[mainCategory]) {
      acc[mainCategory] = [];
    }
    acc[mainCategory].push(place);
    return acc;
  }, {} as Record<string, PropertyNearbyPlace[]>);

  // Sort categories to ensure our main ones come first
  const sortedCategories = [
    ...Object.keys(categoryMapping),
    ...Object.keys(placesByCategory).filter(cat => !categoryMapping[cat])
  ];

  // State for active category tab
  const [activeCategory, setActiveCategory] = useState(sortedCategories[0]);
  
  // Format a place's distance for display
  const formatDistance = (distance?: number | string): string => {
    if (distance === undefined || distance === null) return "";
    
    // Convert string to number if needed
    const numDistance = typeof distance === 'string' ? parseFloat(distance) : distance;
    
    // Handle NaN
    if (isNaN(numDistance)) return "";
    
    // Format based on distance
    if (numDistance < 1) {
      return `${Math.round(numDistance * 1000)} m`;
    }
    
    return `${numDistance.toFixed(1)} km`;
  };
  
  return (
    <div className="space-y-2">
      <div className="px-6">
        <div className="grid grid-cols-10 gap-6">
          {/* Left side: Location Description */}
          <div className="col-span-7 webview-card p-6 rounded-lg">
          <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: settings?.secondaryColor }}
            >
              Neighborhood
            </h3>
            {property.location_description && (
              <div ref={descriptionRef}>
               
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {property.location_description}
                </p>
              </div>
            )}
          </div>

          {/* Right side: Property Location Map */}
          <div 
            className="col-span-3 rounded-lg overflow-hidden shadow-md relative"
            style={{ height: descriptionHeight || 'auto' }}
          >
            {property.latitude && property.longitude ? (
              <iframe
                src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No location data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Nearby Places */}
        {Object.entries(placesByCategory).length > 0 && (
          <div className="mt-8">
          <div className="bg-white/90 p-4 rounded-lg shadow-sm">
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: settings?.secondaryColor }}
            >
              Nearby Places
            </h3>
            
            <div>
              <div className="mb-6 flex gap-2 flex-wrap">
                {sortedCategories.map(category => 
                  placesByCategory[category]?.length > 0 && (
                    <button
                      key={category}
                      className={`px-5 py-2.5 rounded-full transition-all ${
                        activeCategory === category
                          ? 'text-white shadow-md text-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm'
                      }`}
                      style={{
                        backgroundColor: activeCategory === category ? secondaryColor : undefined,
                        borderColor: secondaryColor,
                        borderWidth: activeCategory === category ? 0 : 1
                      }}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
              
              <div>
                {sortedCategories.map(category => 
                  placesByCategory[category]?.length > 0 && 
                  activeCategory === category && (
                    <div key={category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {placesByCategory[category].map((place, index) => (
                          <div 
                            key={index}
                            className="webview-card flex flex-col p-5 rounded-lg"
                          >
                            <div className="flex flex-col mb-3">
                              <span 
                                className="font-semibold text-xs mb-1"
                                style={{ color: primaryColor }}
                              >
                                {place.name}
                              </span>
                              {place.vicinity && (
                                <span className="text-gray-500 text-sm">{place.vicinity}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                              {place.rating && (
                                <div className="flex items-center">
                                  <span className="text-yellow-500 mr-1">★</span>
                                  <span 
                                    className="text-sm font-semibold"
                                    style={{ color: secondaryColor }}
                                  >
                                    {place.rating}
                                  </span>
                                  {place.user_ratings_total && (
                                    <span className="text-xs text-gray-400 ml-1">
                                      ({place.user_ratings_total})
                                    </span>
                                  )}
                                </div>
                              )}
                              <span className="text-gray-500 text-sm font-medium">
                                {formatDistance(place.distance)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
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
