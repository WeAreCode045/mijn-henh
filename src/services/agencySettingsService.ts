
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";

interface AgencySettingsData {
  name: string;
  email: string;
  phone: string;
  address: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  description_background_url?: string;
  icon_build_year: string;
  icon_bedrooms: string;
  icon_bathrooms: string;
  icon_garages: string;
  icon_energy_class: string;
  icon_sqft: string;
  icon_living_space: string;
  google_maps_api_key: string;
  xml_import_url: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  global_features?: string[] | null;
  // SMTP settings
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  smtp_secure?: boolean;
  // Mailjet settings
  mailjet_api_key?: string;
  mailjet_api_secret?: string;
  mailjet_from_email?: string;
  mailjet_from_name?: string;
  // OpenAI API key
  openai_api_key?: string;
}

export const agencySettingsService = {
  async uploadLogo(file: Blob, filename: string) {
    const { data, error } = await supabase.storage
      .from('agency_files')
      .upload(filename, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('agency_files')
      .getPublicUrl(filename);

    return publicUrl;
  },

  async uploadBackground(file: Blob, filename: string) {
    const { data, error } = await supabase.storage
      .from('agency_files')
      .upload(filename, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('agency_files')
      .getPublicUrl(filename);

    return publicUrl;
  },

  async updateSettings(id: string, data: AgencySettings) {
    const updateData: AgencySettingsData = {
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      primary_color: data.primaryColor || "#40497A",
      secondary_color: data.secondaryColor || "#E2E8F0",
      logo_url: data.logoUrl,
      description_background_url: data.pdfBackgroundUrl || data.webviewBackgroundUrl, 
      icon_build_year: data.iconBuildYear || "calendar",
      icon_bedrooms: data.iconBedrooms || "bed",
      icon_bathrooms: data.iconBathrooms || "bath",
      icon_garages: data.iconGarages || "car",
      icon_energy_class: data.iconEnergyClass || "zap",
      icon_sqft: data.iconSqft || "ruler",
      icon_living_space: data.iconLivingSpace || "home",
      google_maps_api_key: data.googleMapsApiKey || "",
      xml_import_url: data.xmlImportUrl || "",
      instagram_url: data.instagramUrl,
      youtube_url: data.youtubeUrl,
      facebook_url: data.facebookUrl,
      global_features: data.globalFeatures,
      // SMTP settings
      smtp_host: data.smtpHost || null,
      smtp_port: data.smtpPort || null,
      smtp_username: data.smtpUsername || null,
      smtp_password: data.smtpPassword || null,
      smtp_from_email: data.smtpFromEmail || null,
      smtp_from_name: data.smtpFromName || null,
      smtp_secure: data.smtpSecure || false,
      // Mailjet settings
      mailjet_api_key: data.mailjetApiKey || null,
      mailjet_api_secret: data.mailjetApiSecret || null,
      mailjet_from_email: data.mailjetFromEmail || null,
      mailjet_from_name: data.mailjetFromName || null,
      // OpenAI API key
      openai_api_key: data.openaiApiKey || null,
    };

    const { error } = await supabase
      .from('agency_settings')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  },

  async createSettings(data: AgencySettingsData) {
    const { error } = await supabase
      .from('agency_settings')
      .insert(data);

    if (error) throw error;
  }
};

// Export a function that can be imported as 'updateAgencySettings'
export const updateAgencySettings = async (settings: AgencySettings) => {
  if (!settings.id) {
    throw new Error("Settings ID is required for update");
  }
  
  return await agencySettingsService.updateSettings(settings.id, settings);
};
