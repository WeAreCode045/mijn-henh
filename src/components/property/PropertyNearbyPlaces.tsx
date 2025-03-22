
import { PropertyPlaceType } from "@/types/property";

interface PropertyNearbyPlacesProps {
  places: PropertyPlaceType[];
}

export function PropertyNearbyPlaces({ places }: PropertyNearbyPlacesProps) {
  if (!places || places.length === 0) return null;

  const placesByType = places.reduce((acc: Record<string, PropertyPlaceType[]>, place) => {
    if (!acc[place.type]) {
      acc[place.type] = [];
    }
    acc[place.type].push(place);
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-lg">Nearby Places</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(placesByType).map(([type, places]) => (
          <div key={type} className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 capitalize">{type.replace('_', ' ')}</h4>
            <ul className="space-y-2">
              {places.map((place) => (
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
  );
}
