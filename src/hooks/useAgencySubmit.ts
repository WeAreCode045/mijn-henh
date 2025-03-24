
import { useState } from "react";
import { AgencySettings } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { agencySettingsService } from "@/services/agencySettingsService";

interface UseAgencySubmitProps {
  settings: AgencySettings;
  setSettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
  logoPreview: string | null;
}

export const useAgencySubmit = ({ settings, setSettings, logoPreview }: UseAgencySubmitProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = settings.logoUrl;

      if (logoPreview && !logoPreview.startsWith('http')) {
        const file = await (await fetch(logoPreview)).blob();
        const filename = `logo-${Date.now()}.png`;
        logoUrl = await agencySettingsService.uploadLogo(file, filename);
      }

      const updateData = {
        ...settings,
        logoUrl
      };

      if (settings.id) {
        await agencySettingsService.updateSettings(settings.id, updateData);
      } else {
        const createData = {
          name: settings.name,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          logo_url: logoUrl,
          description_background_url: settings.pdfBackgroundUrl || settings.webviewBackgroundUrl,
          icon_build_year: settings.iconBuildYear,
          icon_bedrooms: settings.iconBedrooms,
          icon_bathrooms: settings.iconBathrooms,
          icon_garages: settings.iconGarages,
          icon_energy_class: settings.iconEnergyClass,
          icon_sqft: settings.iconSqft,
          icon_living_space: settings.iconLivingSpace,
          google_maps_api_key: settings.googleMapsApiKey,
          xml_import_url: settings.xmlImportUrl,
          instagram_url: settings.instagramUrl,
          youtube_url: settings.youtubeUrl,
          facebook_url: settings.facebookUrl
        };
        await agencySettingsService.createSettings(createData);
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      const newSettings = await fetchAgencySettings();
      if (newSettings) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
