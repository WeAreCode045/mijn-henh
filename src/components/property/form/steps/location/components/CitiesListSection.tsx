
import { PropertyCity } from "@/types/property";
import { CityItem } from "./CityItem";

interface CitiesListSectionProps {
  cities: PropertyCity[];
  toggleVisibility: (cityIndex: number, visible: boolean) => void;
  isVisible: (city: PropertyCity) => boolean;
}

export function CitiesListSection({ 
  cities, 
  toggleVisibility, 
  isVisible 
}: CitiesListSectionProps) {
  if (cities.length === 0) {
    return (
      <p className="text-sm text-gray-500">No nearby cities found. Use the button above to fetch data.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {cities.map((city, index) => (
        <CityItem
          key={index}
          city={city}
          index={index}
          onVisibilityChange={toggleVisibility}
        />
      ))}
    </div>
  );
}
