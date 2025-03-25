
import { useState } from "react";
import { AgencySettings } from "@/types/agency";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFeature } from "@/types/property";

interface UseAgencySubmitProps {
  settings: AgencySettings;
  setSettings: (settings: AgencySettings) => void;
  logoPreview: string;
  globalFeatures?: PropertyFeature[];
}

export const useAgencySubmit = ({ 
  settings, 
  setSettings, 
  logoPreview,
  globalFeatures = []
}: UseAgencySubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('agency_settings')
        .update({
          name: settings.name,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          primary_color: settings.primaryColor || settings.primary_color,
          secondary_color: settings.secondaryColor || settings.secondary_color,
          logo_url: logoPreview || settings.logo_url,
          description_background_url: settings.description_background_url,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          youtube_url: settings.youtube_url,
          google_maps_api_key: settings.google_maps_api_key,
          xml_import_url: settings.xml_import_url,
          icon_bedrooms: settings.icon_bedrooms,
          icon_bathrooms: settings.icon_bathrooms,
          icon_sqft: settings.icon_sqft,
          icon_living_space: settings.icon_living_space,
          icon_build_year: settings.icon_build_year,
          icon_garages: settings.icon_garages,
          icon_energy_class: settings.icon_energy_class,
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          smtp_username: settings.smtp_username,
          smtp_password: settings.smtp_password,
          smtp_from_email: settings.smtp_from_email,
          smtp_from_name: settings.smtp_from_name,
          smtp_secure: settings.smtp_secure,
          openai_api_key: settings.openai_api_key,
          global_features: JSON.stringify(globalFeatures.map(f => f.description))
        })
        .eq('id', settings.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });

      // Update the settings state with the latest data
      const { data: latestSettings, error: fetchError } = await supabase
        .from('agency_settings')
        .select('*')
        .eq('id', settings.id)
        .single();

      if (!fetchError && latestSettings) {
        setSettings({
          ...latestSettings,
          primaryColor: latestSettings.primary_color,
          secondaryColor: latestSettings.secondary_color,
          logoUrl: latestSettings.logo_url,
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
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
    handleSubmit,
  };
};
