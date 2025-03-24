
import { PropertyNearbyPlace, PropertyPlaceType } from "@/types/property";

interface PropertyNearbyPlacesProps {
  places: PropertyNearbyPlace[];
}

export function PropertyNearbyPlaces({ places }: PropertyNearbyPlacesProps) {
  if (!places || places.length === 0) return null;

  // First group by category
  const placesByCategory = places.reduce((acc: Record<string, Record<string, PropertyNearbyPlace[]>>, place) => {
    const category = place.category || 'Other'; 
    const type = place.type;
    
    if (!acc[category]) {
      acc[category] = {};
    }
    
    if (!acc[category][type]) {
      acc[category][type] = [];
    }
    
    acc[category][type].push(place);
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-lg">Nearby Places</h3>
      <div className="space-y-4">
        {Object.entries(placesByCategory).map(([category, typeGroups]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium mb-2">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(typeGroups).map(([type, places]) => (
                <div key={type} className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2 capitalize">{type.replace('_', ' ')}</h5>
                  <ul className="space-y-2">
                    {places
                      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                      .map((place) => (
                        <li key={place.id} className="text-sm">
                          <span className="font-medium">{place.name}</span>
                          {place.rating && (
                            <span className="text-yellow-500 ml-2">★ {place.rating}</span>
                          )}
                          {place.vicinity && (
                            <p className="text-gray-500 text-xs mt-1">{place.vicinity}</p>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
