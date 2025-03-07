
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { 
  CalendarDays, 
  BedDouble, 
  Bath, 
  Car, 
  Zap, 
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
      case 'zap':
      case 'lightning':
        return <Zap size={iconSize} />;
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
  const safeSettings = settings || {};
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {property.buildYear && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconBuildYear)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Year Built</p>
              <p className="font-medium">{property.buildYear}</p>
            </div>
          </div>
        )}
        
        {parseValueToNumber(property.bedrooms) > 0 && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconBedrooms)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Bedrooms</p>
              <p className="font-medium">{property.bedrooms}</p>
            </div>
          </div>
        )}
        
        {parseValueToNumber(property.bathrooms) > 0 && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconBathrooms)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Bathrooms</p>
              <p className="font-medium">{property.bathrooms}</p>
            </div>
          </div>
        )}
        
        {parseValueToNumber(property.garages) > 0 && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconGarages)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Garages</p>
              <p className="font-medium">{property.garages}</p>
            </div>
          </div>
        )}
        
        {property.energyLabel && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconEnergyClass)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Energy Class</p>
              <p className="font-medium">{property.energyLabel.toUpperCase()}</p>
            </div>
          </div>
        )}
        
        {parseValueToNumber(property.sqft) > 0 && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconSqft)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Plot Size</p>
              <p className="font-medium">{formatNumber(property.sqft)} m²</p>
            </div>
          </div>
        )}
        
        {parseValueToNumber(property.livingArea) > 0 && (
          <div className="flex items-center gap-3">
            <div className="webview-detail-icon">
              {getIcon(safeSettings.iconLivingSpace)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Living Space</p>
              <p className="font-medium">{formatNumber(property.livingArea)} m²</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

