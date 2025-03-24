
import { PropertyNearbyPlace } from "@/types/property";

interface PropertyNearbyPlacesProps {
  places: PropertyNearbyPlace[];
}

export function PropertyNearbyPlaces({ places }: PropertyNearbyPlacesProps) {
  if (!places || places.length === 0) return null;

  // Group places by category for better organization
  const placesByCategory = places.reduce((acc: Record<string, PropertyNearbyPlace[]>, place) => {
    const category = place.category || place.type || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-lg">Nearby Places</h3>
      <div className="space-y-6">
        {Object.entries(placesByCategory).map(([category, categoryPlaces]) => (
          <div key={category} className="border rounded-lg p-4">
            <h4 className="font-medium mb-3 capitalize">{category.replace('_', ' ')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPlaces.map((place) => (
                <div key={place.id} className="text-sm bg-muted/30 p-3 rounded">
                  <div className="font-medium">{place.name}</div>
                  {place.rating && (
                    <div className="text-yellow-500 text-sm">★ {place.rating}</div>
                  )}
                  {place.vicinity && (
                    <p className="text-gray-500 text-xs mt-1">{place.vicinity}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
