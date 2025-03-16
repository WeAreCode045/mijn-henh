
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyDetailsProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function PropertyDetails({ property, settings }: PropertyDetailsProps) {
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});
  
  // Fetch and generate URLs for the icons
  useEffect(() => {
    const fetchIcons = async () => {
      const iconsToFetch = [
        settings?.iconBuildYear || 'calendar',
        settings?.iconBedrooms || 'bed',
        settings?.iconBathrooms || 'bath',
        settings?.iconGarages || 'car',
        settings?.iconSqft || 'ruler',
        settings?.iconLivingSpace || 'home',
        settings?.iconEnergyClass || 'zap'
      ];
      
      const iconUrlMap: Record<string, string> = {};
      
      for (const iconName of iconsToFetch) {
        try {
          // Get public URL for the icon
          const { data } = await supabase.storage
            .from('global')
            .getPublicUrl(`icons/dark/${iconName}.svg`);
          
          if (data?.publicUrl) {
            iconUrlMap[iconName] = data.publicUrl;
          }
        } catch (error) {
          console.error(`Error fetching icon ${iconName}:`, error);
        }
      }
      
      setIconUrls(iconUrlMap);
    };
    
    fetchIcons();
  }, [settings]);
  
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
  // Using defaultAgencySettings for colors if settings is undefined
  const safeSettings: AgencySettings = settings || {
    name: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: defaultAgencySettings.primaryColor,
    secondaryColor: defaultAgencySettings.secondaryColor,
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
    return `https://gjvpptmwijiosgdcozep.supabase.co/storage/v1/object/public/global/energy/${property.energyLabel.toUpperCase()}.png`;
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Icon Grid Section - Takes up 3/4 of space on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:w-3/4">
          {property.buildYear && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconBuildYear] ? (
                  <img 
                    src={iconUrls[safeSettings.iconBuildYear]} 
                    alt="Year Built" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">C</span>
                )}
              </div>
              <div>
                <p className="text-xs text-white/80">Year Built</p>
                <p className="font-medium text-white">{property.buildYear}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.bedrooms) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconBedrooms] ? (
                  <img 
                    src={iconUrls[safeSettings.iconBedrooms]} 
                    alt="Bedrooms" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">B</span>
                )}
              </div>
              <div>
                <p className="text-xs text-white/80">Bedrooms</p>
                <p className="font-medium text-white">{property.bedrooms}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.bathrooms) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconBathrooms] ? (
                  <img 
                    src={iconUrls[safeSettings.iconBathrooms]} 
                    alt="Bathrooms" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">B</span>
                )}
              </div>
              <div>
                <p className="text-xs text-white/80">Bathrooms</p>
                <p className="font-medium text-white">{property.bathrooms}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.garages) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconGarages] ? (
                  <img 
                    src={iconUrls[safeSettings.iconGarages]} 
                    alt="Garages" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">G</span>
                )}
              </div>
              <div>
                <p className="text-xs text-white/80">Garages</p>
                <p className="font-medium text-white">{property.garages}</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.sqft) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconSqft] ? (
                  <img 
                    src={iconUrls[safeSettings.iconSqft]} 
                    alt="Plot Size" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">P</span>
                )}
              </div>
              <div>
                <p className="text-xs text-white/80">Plot Size</p>
                <p className="font-medium text-white">{formatNumber(property.sqft)} m²</p>
              </div>
            </div>
          )}
          
          {parseValueToNumber(property.livingArea) > 0 && (
            <div className="flex items-center gap-3 rounded-lg p-3 bg-primary-color">
              <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                {iconUrls[safeSettings.iconLivingSpace] ? (
                  <img 
                    src={iconUrls[safeSettings.iconLivingSpace]} 
                    alt="Living Space" 
                    className="w-6 h-6" 
                  />
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center">L</span>
                )}
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
