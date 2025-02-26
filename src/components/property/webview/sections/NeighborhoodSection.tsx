
import { Check } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { WebViewSectionProps } from "../types";

export function NeighborhoodSection({ property, settings, waitForPlaces = false }: WebViewSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [places, setPlaces] = useState<{ name: string; category: string; distance: string }[]>([]);

  useEffect(() => {
    let map: google.maps.Map | null = null;
    let service: google.maps.places.PlacesService | null = null;

    const initMap = () => {
      if (!mapRef.current) return;

      const lat = parseFloat(property.latitude || "0");
      const lng = parseFloat(property.longitude || "0");
      
      if (isNaN(lat) || isNaN(lng)) return;

      const location = { lat, lng };
      map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      const marker = new google.maps.Marker({
        position: location,
        map,
        title: property.title,
      });

      setMapLoaded(true);

      // Nearby places search
      if (!waitForPlaces) {
        service = new google.maps.places.PlacesService(map);
        
        const placesTypes = [
          "school",
          "restaurant",
          "shopping_mall",
          "supermarket",
          "park",
          "hospital",
          "transit_station"
        ];

        const categoryMap: { [key: string]: string } = {
          school: "Education",
          restaurant: "Dining",
          shopping_mall: "Shopping",
          supermarket: "Grocery",
          park: "Recreation",
          hospital: "Healthcare",
          transit_station: "Transportation"
        };

        const allPlaces: { name: string; category: string; distance: string }[] = [];

        placesTypes.forEach(type => {
          service?.nearbySearch(
            {
              location,
              radius: 1500,
              type: type as google.maps.places.PlaceType
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const topResults = results
                  .slice(0, 3)
                  .map(place => {
                    // Calculate distance
                    const placeLocation = place.geometry?.location;
                    let distance = "";
                    if (placeLocation) {
                      const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                        new google.maps.LatLng(lat, lng),
                        placeLocation
                      );
                      distance = `${(distanceInMeters / 1000).toFixed(1)} km`;
                    }

                    return {
                      name: place.name || "Unknown place",
                      category: categoryMap[type] || "Other",
                      distance
                    };
                  });

                allPlaces.push(...topResults);
                setPlaces([...allPlaces]);
              }
            }
          );
        });
      }
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      console.log("Google Maps API not loaded");
    }

    return () => {
      // Cleanup
    };
  }, [property.latitude, property.longitude, waitForPlaces]);

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6">
        <h3 className="text-xl font-semibold mb-4">Location & Nearby Places</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map */}
          <div className="h-[300px] rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full"></div>
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
              {places.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  {waitForPlaces ? "Places data will be available in the printed version." : "No nearby places found."}
                </p>
              ) : (
                <ul className="space-y-2">
                  {places.map((place, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5" />
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
