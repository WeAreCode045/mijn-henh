
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";
import { defaultAgencySettings } from "./defaultAgencySettings";

export async function fetchAgencySettings(): Promise<AgencySettings | null> {
  const { data, error } = await supabase
    .from('agency_settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  if (!data) return null;

  // Safely handle the global_features field - ensure it's an array of strings
  let globalFeatures: string[] = [];
  if (data.global_features) {
    if (Array.isArray(data.global_features)) {
      // If it's already an array, use it
      globalFeatures = data.global_features as string[];
    } else if (typeof data.global_features === 'string') {
      // If it's a JSON string, try to parse it
      try {
        const parsed = JSON.parse(data.global_features as string);
        if (Array.isArray(parsed)) {
          globalFeatures = parsed;
        }
      } catch (e) {
        // In case of parsing error, keep it as an empty array
        console.error('Error parsing global_features:', e);
      }
    }
  }

  return {
    id: String(data.id),
    name: data.name || defaultAgencySettings.name,
    email: data.email || defaultAgencySettings.email,
    phone: data.phone || defaultAgencySettings.phone,
    address: data.address || defaultAgencySettings.address,
    primaryColor: data.primary_color || defaultAgencySettings.primaryColor,
    secondaryColor: data.secondary_color || defaultAgencySettings.secondaryColor,
    logoUrl: data.logo_url,
    pdfBackgroundUrl: data.description_background_url,
    webviewBackgroundUrl: data.description_background_url,
    webviewBgImage: data.description_background_url,
    instagramUrl: data.instagram_url || defaultAgencySettings.instagramUrl,
    youtubeUrl: data.youtube_url || defaultAgencySettings.youtubeUrl,
    facebookUrl: data.facebook_url || defaultAgencySettings.facebookUrl,
    iconBuildYear: data.icon_build_year || defaultAgencySettings.iconBuildYear,
    iconBedrooms: data.icon_bedrooms || defaultAgencySettings.iconBedrooms,
    iconBathrooms: data.icon_bathrooms || defaultAgencySettings.iconBathrooms,
    iconGarages: data.icon_garages || defaultAgencySettings.iconGarages,
    iconEnergyClass: data.icon_energy_class || defaultAgencySettings.iconEnergyClass,
    iconSqft: data.icon_sqft || defaultAgencySettings.iconSqft,
    iconLivingSpace: data.icon_living_space || defaultAgencySettings.iconLivingSpace,
    googleMapsApiKey: data.google_maps_api_key || defaultAgencySettings.googleMapsApiKey,
    xmlImportUrl: data.xml_import_url || defaultAgencySettings.xmlImportUrl,
    // Use the processed globalFeatures
    globalFeatures: globalFeatures,
    // SMTP settings
    smtpHost: data.smtp_host || null,
    smtpPort: data.smtp_port || null,
    smtpUsername: data.smtp_username || null,
    smtpPassword: data.smtp_password || null,
    smtpFromEmail: data.smtp_from_email || null,
    smtpFromName: data.smtp_from_name || null,
    smtpSecure: data.smtp_secure || false,
    // OpenAI API key
    openaiApiKey: data.openai_api_key || null,
  };
}
