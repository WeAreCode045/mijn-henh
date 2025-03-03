
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
  // SMTP settings
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  smtp_secure?: boolean;
  // Appwrite settings - these fields might not exist in the database yet
  appwrite_endpoint?: string;
  appwrite_project_id?: string;
  appwrite_database_id?: string;
  appwrite_properties_collection_id?: string;
  appwrite_agents_collection_id?: string;
  appwrite_templates_collection_id?: string;
  appwrite_storage_bucket_id?: string;
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
    // Create the data object with all existing fields
    const updateData: AgencySettingsData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      primary_color: data.primaryColor,
      secondary_color: data.secondaryColor,
      logo_url: data.logoUrl,
      description_background_url: data.pdfBackgroundUrl || data.webviewBackgroundUrl,
      icon_build_year: data.iconBuildYear,
      icon_bedrooms: data.iconBedrooms,
      icon_bathrooms: data.iconBathrooms,
      icon_garages: data.iconGarages,
      icon_energy_class: data.iconEnergyClass,
      icon_sqft: data.iconSqft,
      icon_living_space: data.iconLivingSpace,
      google_maps_api_key: data.googleMapsApiKey,
      xml_import_url: data.xmlImportUrl,
      instagram_url: data.instagramUrl,
      youtube_url: data.youtubeUrl,
      facebook_url: data.facebookUrl,
      // SMTP settings
      smtp_host: data.smtp_host || null,
      smtp_port: data.smtp_port || null,
      smtp_username: data.smtp_username || null,
      smtp_password: data.smtp_password || null,
      smtp_from_email: data.smtp_from_email || null,
      smtp_from_name: data.smtp_from_name || null,
      smtp_secure: data.smtp_secure || false,
    };
    
    // Note: We're not adding the Appwrite fields to the update data
    // since they don't exist in the database yet.
    // You'll need to update your database schema to include these fields.
    
    // For now, we'll just log a warning
    console.log("Note: Appwrite settings will be saved in local storage only until the database schema is updated.");

    const { error } = await supabase
      .from('agency_settings')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    
    // Save Appwrite settings to localStorage as a temporary solution
    if (typeof window !== 'undefined') {
      localStorage.setItem('appwrite_settings', JSON.stringify({
        appwrite_endpoint: data.appwrite_endpoint,
        appwrite_project_id: data.appwrite_project_id,
        appwrite_database_id: data.appwrite_database_id,
        appwrite_properties_collection_id: data.appwrite_properties_collection_id,
        appwrite_agents_collection_id: data.appwrite_agents_collection_id,
        appwrite_templates_collection_id: data.appwrite_templates_collection_id,
        appwrite_storage_bucket_id: data.appwrite_storage_bucket_id
      }));
    }
  },

  async createSettings(data: AgencySettingsData) {
    const { error } = await supabase
      .from('agency_settings')
      .insert(data);

    if (error) throw error;
  }
};
