
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { 
  CalendarDays, 
  BedDouble, 
  Bath, 
  Car, 
  Ruler, 
  Home,
  MapPin,
  Landmark,
  Building
} from "lucide-react";

interface PropertyDetailsProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function PropertyDetails({ property, settings }: PropertyDetailsProps) {
  const iconSize = 18;
  
  // Map icon names to actual components
  const getIcon = (iconName: string | undefined) => {
    // Default to calendar if iconName is undefined
    const iconToRender = iconName?.toLowerCase() || 'calendar';
    
    switch (iconToRender) {
      case 'calendar':
      case 'calendars':
      case 'calendardays':
        return <CalendarDays size={iconSize} />;
      case 'bed':
      case 'beddouble':
        return <BedDouble size={iconSize} />;
      case 'bath':
        return <Bath size={iconSize} />;
      case 'car':
        return <Car size={iconSize} />;
      case 'ruler':
        return <Ruler size={iconSize} />;
      case 'home':
        return <Home size={iconSize} />;
      case 'mappin':
        return <MapPin size={iconSize} />;
      case 'landmark':
        return <Landmark size={iconSize} />;
      case 'building':
        return <Building size={iconSize} />;
      default:
        return <CalendarDays size={iconSize} />;
    }
  };

  // Format the number with commas for thousands
  const formatNumber = (num?: number | string) => {
    if (num === undefined || num === null) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to convert string to number for comparison
  const parseValueToNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Safely get icon names with fallbacks
  // Explicitly type safeSettings as AgencySettings to ensure TypeScript knows all properties exist
  const safeSettings: AgencySettings = settings || {
    name: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: "",
    secondaryColor: "",
    iconBuildYear: "calendar",
    iconBedrooms: "bed",
    iconBathrooms: "bath",
    iconGarages: "car",
    iconEnergyClass: "zap",
    iconSqft: "ruler",
    iconLivingSpace: "home"
  };

  // Get energy label image path based on energy class
  const getEnergyLabelImagePath = () => {
    if (!property.energyLabel) return null;
    return `/energy/${property.energyLabel.toUpperCase()}.png`;
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Icon Grid Section - Takes up 3/4 of space on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:w-3/4">
          {property.buildYear && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconBuildYear)}
              </div>
              <div>
                <p className="text-xs text-white/80">Year Built</p>
                <p className="font-medium text-white">{property.buildYear}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.bedrooms) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconBedrooms)}
              </div>
              <div>
                <p className="text-xs text-white/80">Bedrooms</p>
                <p className="font-medium text-white">{property.bedrooms}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.bathrooms) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconBathrooms)}
              </div>
              <div>
                <p className="text-xs text-white/80">Bathrooms</p>
                <p className="font-medium text-white">{property.bathrooms}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.garages) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconGarages)}
              </div>
              <div>
                <p className="text-xs text-white/80">Garages</p>
                <p className="font-medium text-white">{property.garages}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.sqft) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconSqft)}
              </div>
              <div>
                <p className="text-xs text-white/80">Plot Size</p>
                <p className="font-medium text-white">{formatNumber(property.sqft)} m²</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.livingArea) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: settings?.primaryColor }}>
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {getIcon(safeSettings.iconLivingSpace)}
              </div>
              <div>
                <p className="text-xs text-white/80">Living Space</p>
                <p className="font-medium text-white">{formatNumber(property.livingArea)} m²</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Energy Label Section - Takes up 1/4 of space on larger screens */}
        {property.energyLabel && (
          <div className="md:w-1/4 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium mb-2">Energy Class</p>
              <img 
                src={getEnergyLabelImagePath()} 
                alt={`Energy Class ${property.energyLabel.toUpperCase()}`} 
                className="w-full max-w-[150px] h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
