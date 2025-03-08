
import { PropertyFormData } from "@/types/property";
import { CityItem } from "./CityItem";

interface CitiesListSectionProps {
  nearbyCities: Array<{name: string, distance: number, visible_in_webview?: boolean}>;
  toggleCityVisibility: (cityIndex: number, visible: boolean) => void;
}

export function CitiesListSection({ nearbyCities, toggleCityVisibility }: CitiesListSectionProps) {
  if (nearbyCities.length === 0) {
    return (
      <p className="text-sm text-gray-500">No nearby cities found. Use the button above to fetch data.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {nearbyCities.map((city, index) => (
        <CityItem
          key={index}
          city={city}
          index={index}
          onVisibilityChange={toggleCityVisibility}
        />
      ))}
    </div>
  );
}
