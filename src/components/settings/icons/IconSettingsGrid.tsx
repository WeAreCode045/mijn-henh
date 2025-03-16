
import { AgencySettings } from "@/types/agency";
import { IconSelector } from "./IconSelector";

interface IconSettingsGridProps {
  settings: AgencySettings;
  onSelectChange: (name: string, value: string) => void;
}

export const IconSettingsGrid = ({ settings, onSelectChange }: IconSettingsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <IconSelector 
        label="Build Year Icon"
        value={settings.iconBuildYear || 'calendar'}
        defaultIcon="calendar"
        onChange={(value) => onSelectChange("iconBuildYear", value)}
      />
      
      <IconSelector 
        label="Bedrooms Icon"
        value={settings.iconBedrooms || 'bed'}
        defaultIcon="bed"
        onChange={(value) => onSelectChange("iconBedrooms", value)}
      />
      
      <IconSelector 
        label="Bathrooms Icon"
        value={settings.iconBathrooms || 'bath'}
        defaultIcon="bath"
        onChange={(value) => onSelectChange("iconBathrooms", value)}
      />
      
      <IconSelector 
        label="Garages Icon"
        value={settings.iconGarages || 'car'}
        defaultIcon="car"
        onChange={(value) => onSelectChange("iconGarages", value)}
      />
      
      <IconSelector 
        label="Energy Class Icon"
        value={settings.iconEnergyClass || 'zap'}
        defaultIcon="zap"
        onChange={(value) => onSelectChange("iconEnergyClass", value)}
      />
      
      <IconSelector 
        label="Plot Size Icon"
        value={settings.iconSqft || 'ruler'}
        defaultIcon="ruler"
        onChange={(value) => onSelectChange("iconSqft", value)}
      />
      
      <IconSelector 
        label="Living Space Icon"
        value={settings.iconLivingSpace || 'home'}
        defaultIcon="home"
        onChange={(value) => onSelectChange("iconLivingSpace", value)}
      />
    </div>
  );
};
