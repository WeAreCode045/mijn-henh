
import React from "react";
import { PropertyData } from "@/types/property";
import { StarIcon } from "lucide-react";
import { groupPlacesByCategory } from "../../form/steps/location/utils/placeUtils";

// Import WebviewSectionTitle from the correct path
import { WebviewSectionTitle } from "../components/WebviewSectionTitle";

interface NeighborhoodSectionProps {
  property: PropertyData;
  waitForPlaces?: boolean;
}

export function NeighborhoodSection({ property, waitForPlaces }: NeighborhoodSectionProps) {
  if (!property.nearby_places || property.nearby_places.length === 0) {
    return null;
  }

  // Filter only places that are marked as visible
  const visiblePlaces = property.nearby_places.filter(place => 
    place.visible_in_webview !== false
  );

  if (visiblePlaces.length === 0) {
    return null;
  }

  // Group the places by category
  const placesByCategory = React.useMemo(() => {
    return groupPlacesByCategory(visiblePlaces);
  }, [visiblePlaces]);

  // Get all categories from the grouped places
  const categories = Object.keys(placesByCategory);

  return (
    <div className="py-8 border-b border-estate-100">
      <WebviewSectionTitle title="Omgeving" />
      
      <div className="mt-6 space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-lg">{category}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placesByCategory[category].map(place => (
                <div 
                  key={place.id} 
                  className="p-4 bg-white rounded-lg border border-estate-100 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-estate-800">{place.name}</h4>
                      {place.vicinity && (
                        <p className="text-sm text-estate-500 mt-1">{place.vicinity}</p>
                      )}
                    </div>
                    
                    {place.rating && (
                      <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                        <StarIcon className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
