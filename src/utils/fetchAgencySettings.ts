
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";

export async function fetchAgencySettings(): Promise<AgencySettings | null> {
  try {
    const { data, error } = await supabase
      .from('agency_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching agency settings:', error);
      return null;
    }

    if (!data) {
      console.warn('No agency settings found');
      return null;
    }

    // Map database fields to AgencySettings
    const settings: AgencySettings = {
      id: data.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      primaryColor: data.primary_color || "#40497A",
      secondaryColor: data.secondary_color || "#E2E8F0",
      logoUrl: data.logo_url || "",
      webviewBackgroundUrl: data.description_background_url || "",
      webviewBgImage: data.description_background_url || "", // For backward compatibility
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
      agents: Array.isArray(data.agents) ? data.agents : []
    };

    return settings;
  } catch (error) {
    console.error('Error fetching agency settings:', error);
    return null;
  }
}
