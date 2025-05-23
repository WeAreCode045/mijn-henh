
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyDetailCard } from "./details/PropertyDetailCard";
import { EnergyLabelDisplay } from "./details/EnergyLabelDisplay";
import { formatNumber, parseValueToNumber, getSafeSettings } from "./utils/propertyDetailsUtils";

interface PropertyDetailsProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function PropertyDetails({ property, settings }: PropertyDetailsProps) {
  const safeSettings = getSafeSettings(settings);
  const primaryColor = settings?.primaryColor || "#40497A";
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Icon Grid Section - Takes up 3/4 of space on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:w-3/4">
          {property.buildYear && (
            <PropertyDetailCard
              iconName={safeSettings.iconBuildYear}
              label="Year Built"
              value={property.buildYear}
              primaryColor={primaryColor}
            />
          )}
          
          {parseValueToNumber(property.bedrooms) > 0 && (
            <PropertyDetailCard
              iconName={safeSettings.iconBedrooms}
              label="Bedrooms"
              value={property.bedrooms || ""}
              primaryColor={primaryColor}
            />
          )}
          
          {parseValueToNumber(property.bathrooms) > 0 && (
            <PropertyDetailCard
              iconName={safeSettings.iconBathrooms}
              label="Bathrooms"
              value={property.bathrooms || ""}
              primaryColor={primaryColor}
            />
          )}
          
          {parseValueToNumber(property.garages) > 0 && (
            <PropertyDetailCard
              iconName={safeSettings.iconGarages}
              label="Garages"
              value={property.garages || ""}
              primaryColor={primaryColor}
            />
          )}
          
          {parseValueToNumber(property.sqft) > 0 && (
            <PropertyDetailCard
              iconName={safeSettings.iconSqft}
              label="Plot Size"
              value={formatNumber(property.sqft)}
              unit="m²"
              primaryColor={primaryColor}
            />
          )}
          
          {parseValueToNumber(property.livingArea) > 0 && (
            <PropertyDetailCard
              iconName={safeSettings.iconLivingSpace}
              label="Living Space"
              value={formatNumber(property.livingArea)}
              unit="m²"
              primaryColor={primaryColor}
            />
          )}
          

        </div>
        
        {/* Energy Label Section - Takes up 1/4 of space on larger screens */}
        <EnergyLabelDisplay energyLabel={property.energyLabel} />
      </div>
    </div>
  );
}
