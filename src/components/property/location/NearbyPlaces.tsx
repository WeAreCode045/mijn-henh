
import { Button } from "@/components/ui/button";
import { Bus } from "lucide-react";
import { Trash2 } from "lucide-react";
import type { PropertyPlaceType } from "@/types/property";

interface NearbyPlacesProps {
  places: PropertyPlaceType[];
  onPlaceDelete: (e: React.MouseEvent, placeId: string) => Promise<void>;
}

export function NearbyPlaces({ places, onPlaceDelete }: NearbyPlacesProps) {
  const placesByType = places.reduce((acc: Record<string, PropertyPlaceType[]>, place) => {
    // Use place.type if available, otherwise use the first type from place.types array
    let type = place.type || (place.types && place.types.length > 0 ? place.types[0] : 'other');
    
    if (['bus_station', 'train_station', 'transit_station'].includes(type)) {
      type = 'public_transport';
    }
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(place);
    return acc;
  }, {});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public_transport':
        return <Bus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatPlaceType = (type: string) => {
    const typeTranslations: Record<string, string> = {
      'public_transport': 'Openbaar Vervoer',
      'restaurant': 'Restaurant',
      'supermarket': 'Supermarkt',
      'school': 'School',
      'park': 'Park',
      'shopping_mall': 'Winkelcentrum'
    };
    return typeTranslations[type] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (Object.entries(placesByType).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Nabijgelegen Voorzieningen</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(placesByType).map(([type, places]) => (
          <div key={type} className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 capitalize flex items-center gap-2">
              {getTypeIcon(type)}
              {formatPlaceType(type)}
            </h4>
            <ul className="space-y-2">
              {places.map((place) => (
                <li key={place.id} className="text-sm">
                  <div className="flex items-start justify-between group">
                    <div>
                      <span className="font-medium">{place.name}</span>
                      {place.rating && (
                        <span className="text-yellow-500 ml-2">★ {place.rating}</span>
                      )}
                      {place.vicinity && (
                        <p className="text-gray-500 text-xs mt-1">{place.vicinity}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => onPlaceDelete(e, place.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
