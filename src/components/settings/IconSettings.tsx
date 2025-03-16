
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgencySettings } from "@/types/agency";
import { availableIcons, getSvgIconUrl } from "@/utils/iconUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface IconSettingsProps {
  settings: AgencySettings;
  onSelectChange: (name: string, value: string) => void;
}

interface IconPreviewProps {
  iconName: string;
  className?: string;
}

// Component to display the SVG icon preview
const IconPreview = ({ iconName, className = "" }: IconPreviewProps) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIcon = async () => {
      setIsLoading(true);
      try {
        const url = await getSvgIconUrl(iconName);
        setIconUrl(url);
      } catch (error) {
        console.error(`Error loading icon ${iconName}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (iconName) {
      loadIcon();
    }
  }, [iconName]);

  if (isLoading) {
    return <Skeleton className="h-5 w-5 rounded-full" />;
  }

  if (!iconUrl) {
    return <div className={`h-5 w-5 flex items-center justify-center text-xs ${className}`}>{iconName.charAt(0).toUpperCase()}</div>;
  }

  return <img src={iconUrl} alt={iconName} className={`h-5 w-5 ${className}`} />;
};

export const IconSettings = ({ settings, onSelectChange }: IconSettingsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">PDF Icon Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon_build_year">Build Year Icon</Label>
          <Select 
            value={settings.iconBuildYear || 'calendar'} 
            onValueChange={(value) => onSelectChange("iconBuildYear", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconBuildYear && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconBuildYear} className="mr-2" />
                    <span>{settings.iconBuildYear}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_bedrooms">Bedrooms Icon</Label>
          <Select 
            value={settings.iconBedrooms || 'bed'} 
            onValueChange={(value) => onSelectChange("iconBedrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconBedrooms && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconBedrooms} className="mr-2" />
                    <span>{settings.iconBedrooms}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_bathrooms">Bathrooms Icon</Label>
          <Select 
            value={settings.iconBathrooms || 'bath'} 
            onValueChange={(value) => onSelectChange("iconBathrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconBathrooms && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconBathrooms} className="mr-2" />
                    <span>{settings.iconBathrooms}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_garages">Garages Icon</Label>
          <Select 
            value={settings.iconGarages || 'car'} 
            onValueChange={(value) => onSelectChange("iconGarages", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconGarages && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconGarages} className="mr-2" />
                    <span>{settings.iconGarages}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_energy_class">Energy Class Icon</Label>
          <Select 
            value={settings.iconEnergyClass || 'zap'} 
            onValueChange={(value) => onSelectChange("iconEnergyClass", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconEnergyClass && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconEnergyClass} className="mr-2" />
                    <span>{settings.iconEnergyClass}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_sqft">Plot Size Icon</Label>
          <Select 
            value={settings.iconSqft || 'ruler'} 
            onValueChange={(value) => onSelectChange("iconSqft", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconSqft && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconSqft} className="mr-2" />
                    <span>{settings.iconSqft}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_living_space">Living Space Icon</Label>
          <Select 
            value={settings.iconLivingSpace || 'home'} 
            onValueChange={(value) => onSelectChange("iconLivingSpace", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon">
                {settings.iconLivingSpace && (
                  <div className="flex items-center">
                    <IconPreview iconName={settings.iconLivingSpace} className="mr-2" />
                    <span>{settings.iconLivingSpace}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((iconName) => (
                <SelectItem key={iconName} value={iconName} className="flex items-center">
                  <div className="flex items-center">
                    <IconPreview iconName={iconName} className="mr-2" />
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
