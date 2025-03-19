
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";

// Map property names from client-side to database column names
const mapPropertiesToColumns = (settings: AgencySettings) => {
  return {
    name: settings.name || "",
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    primary_color: settings.primaryColor || "#40497A",
    secondary_color: settings.secondaryColor || "#E2E8F0",
    logo_url: settings.logoUrl || "",
    description_background_url: settings.webviewBackgroundUrl || settings.pdfBackgroundUrl || settings.webviewBgImage || "",
    icon_build_year: settings.iconBuildYear || "calendar",
    icon_bedrooms: settings.iconBedrooms || "bed",
    icon_bathrooms: settings.iconBathrooms || "bath",
    icon_garages: settings.iconGarages || "car",
    icon_energy_class: settings.iconEnergyClass || "zap",
    icon_sqft: settings.iconSqft || "ruler",
    icon_living_space: settings.iconLivingSpace || "home",
    google_maps_api_key: settings.googleMapsApiKey || "",
    xml_import_url: settings.xmlImportUrl || "",
    instagram_url: settings.instagramUrl || "",
    youtube_url: settings.youtubeUrl || "",
    facebook_url: settings.facebookUrl || "",
    smtp_host: settings.smtp_host || "",
    smtp_port: settings.smtp_port ? String(settings.smtp_port) : "",
    smtp_username: settings.smtp_username || "",
    smtp_password: settings.smtp_password || "",
    smtp_from_email: settings.smtp_from_email || "",
    smtp_from_name: settings.smtp_from_name || "",
    smtp_secure: settings.smtp_secure || false,
    openai_api_key: settings.openai_api_key || ""
  };
};

// Map database column names to client-side property names
const mapColumnsToProperties = (data: any): AgencySettings => {
  return {
    id: data.id,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    primaryColor: data.primary_color || "#40497A",
    secondaryColor: data.secondary_color || "#E2E8F0",
    logoUrl: data.logo_url || "",
    webviewBackgroundUrl: data.description_background_url || "",
    webviewBgImage: data.description_background_url || "",
    pdfBackgroundUrl: data.description_background_url || "",
    iconBuildYear: data.icon_build_year || "calendar",
    iconBedrooms: data.icon_bedrooms || "bed",
    iconBathrooms: data.icon_bathrooms || "bath",
    iconGarages: data.icon_garages || "car",
    iconEnergyClass: data.icon_energy_class || "zap",
    iconSqft: data.icon_sqft || "ruler",
    iconLivingSpace: data.icon_living_space || "home",
    googleMapsApiKey: data.google_maps_api_key || "",
    xmlImportUrl: data.xml_import_url || "",
    instagramUrl: data.instagram_url || "",
    youtubeUrl: data.youtube_url || "",
    facebookUrl: data.facebook_url || "",
    smtp_host: data.smtp_host || "",
    smtp_port: data.smtp_port || "",
    smtp_username: data.smtp_username || "",
    smtp_password: data.smtp_password || "",
    smtp_from_email: data.smtp_from_email || "",
    smtp_from_name: data.smtp_from_name || "",
    smtp_secure: data.smtp_secure || false,
    openai_api_key: data.openai_api_key || "",
    created_at: data.created_at,
    updated_at: data.updated_at,
    agents: data.agents || []
  };
};

export const agencySettingsService = {
  // Get agency settings from database
  getAgencySettings: async (agencyId: string) => {
    try {
      const { data, error } = await supabase
        .from('agency_settings')
        .select('*')
        .eq('id', agencyId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error fetching agency settings:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Create new agency settings
  createSettings: async (settings: AgencySettings) => {
    try {
      const mappedSettings = mapPropertiesToColumns(settings);
      const { data, error } = await supabase
        .from('agency_settings')
        .insert(mappedSettings)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: mapColumnsToProperties(data)
      };
    } catch (error) {
      console.error("Error creating agency settings:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Update existing agency settings
  updateSettings: async (id: string, settings: AgencySettings) => {
    try {
      const mappedSettings = mapPropertiesToColumns(settings);
      const { data, error } = await supabase
        .from('agency_settings')
        .update(mappedSettings)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: mapColumnsToProperties(data)
      };
    } catch (error) {
      console.error("Error updating agency settings:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Upload logo to storage
  uploadLogo: async (file: Blob, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  },

  // Upload background image
  uploadBackground: async (file: Blob, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading background:", error);
      throw error;
    }
  }
};
