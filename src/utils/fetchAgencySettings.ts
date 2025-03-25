
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

  return {
    id: String(data.id),
    name: data.name || defaultAgencySettings.name,
    email: data.email || defaultAgencySettings.email,
    phone: data.phone || defaultAgencySettings.phone,
    address: data.address || defaultAgencySettings.address,
    primaryColor: data.primary_color || defaultAgencySettings.primaryColor,
    secondaryColor: data.secondary_color || defaultAgencySettings.secondaryColor,
    logoUrl: data.logo_url,
    pdfBackgroundUrl: data.description_background_url, // Use the existing column for PDF background
    webviewBackgroundUrl: data.description_background_url, // Use the same field for webview background
    webviewBgImage: data.description_background_url, // Use the same field for webview background image
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
    // Handle global_features properly - if it's a JSON string, parse it; if it's an array, use it directly
    globalFeatures: data.global_features || [],
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
