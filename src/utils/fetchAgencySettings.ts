
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
    
    // SMTP settings
    smtp_host: data.smtp_host || null,
    smtp_port: data.smtp_port || null,
    smtp_username: data.smtp_username || null,
    smtp_password: data.smtp_password || null,
    smtp_from_email: data.smtp_from_email || null,
    smtp_from_name: data.smtp_from_name || null,
    smtp_secure: data.smtp_secure || false,
    
    // Appwrite settings
    appwrite_endpoint: data.appwrite_endpoint || defaultAgencySettings.appwrite_endpoint,
    appwrite_project_id: data.appwrite_project_id || defaultAgencySettings.appwrite_project_id,
    appwrite_database_id: data.appwrite_database_id || defaultAgencySettings.appwrite_database_id,
    appwrite_properties_collection_id: data.appwrite_properties_collection_id || defaultAgencySettings.appwrite_properties_collection_id,
    appwrite_agents_collection_id: data.appwrite_agents_collection_id || defaultAgencySettings.appwrite_agents_collection_id,
    appwrite_templates_collection_id: data.appwrite_templates_collection_id || defaultAgencySettings.appwrite_templates_collection_id,
    appwrite_storage_bucket_id: data.appwrite_storage_bucket_id || defaultAgencySettings.appwrite_storage_bucket_id
  };
}
