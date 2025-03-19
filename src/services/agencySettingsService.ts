
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";

export async function getAgencySettings(agencyId: string) {
  try {
    const { data, error } = await supabase
      .from('agency_settings')
      .select('*')
      .eq('id', agencyId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching agency settings:', error);
    return { success: false, error };
  }
}

export async function createAgencySettings(settings: AgencySettings) {
  try {
    // Convert settings to match database schema
    const dbSettings = {
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      name: settings.name || 'Agency Name', // Ensure name isn't null
      logo_url: settings.logoUrl,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      description_background_url: settings.description_background_url || settings.pdfBackgroundUrl || settings.webviewBackgroundUrl,
      icon_build_year: settings.icon_build_year || settings.iconBuildYear,
      icon_bedrooms: settings.icon_bedrooms || settings.iconBedrooms,
      icon_bathrooms: settings.icon_bathrooms || settings.iconBathrooms,
      icon_garages: settings.icon_garages || settings.iconGarages,
      icon_energy_class: settings.icon_energy_class || settings.iconEnergyClass,
      icon_sqft: settings.icon_sqft || settings.iconSqft,
      icon_living_space: settings.icon_living_space || settings.iconLivingSpace,
      google_maps_api_key: settings.google_maps_api_key || settings.googleMapsApiKey,
      xml_import_url: settings.xml_import_url || settings.xmlImportUrl,
      instagram_url: settings.instagram_url || settings.instagramUrl,
      youtube_url: settings.youtube_url || settings.youtubeUrl,
      facebook_url: settings.facebook_url || settings.facebookUrl,
      smtp_host: settings.smtp_host,
      smtp_port: settings.smtp_port ? String(settings.smtp_port) : undefined,
      smtp_username: settings.smtp_username,
      smtp_password: settings.smtp_password,
      smtp_from_email: settings.smtp_from_email,
      smtp_from_name: settings.smtp_from_name,
      smtp_secure: settings.smtp_secure,
      openai_api_key: settings.openai_api_key
    };

    const { data, error } = await supabase
      .from('agency_settings')
      .insert(dbSettings)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating agency settings:', error);
    return { success: false, error };
  }
}

export async function updateAgencySettings(settings: AgencySettings) {
  try {
    // Convert settings to match database schema and ensure smtp_port is a string
    const dbSettings = {
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      name: settings.name || 'Agency Name', // Ensure name isn't null
      logo_url: settings.logoUrl,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      description_background_url: settings.description_background_url || settings.pdfBackgroundUrl || settings.webviewBackgroundUrl,
      icon_build_year: settings.icon_build_year || settings.iconBuildYear,
      icon_bedrooms: settings.icon_bedrooms || settings.iconBedrooms,
      icon_bathrooms: settings.icon_bathrooms || settings.iconBathrooms,
      icon_garages: settings.icon_garages || settings.iconGarages,
      icon_energy_class: settings.icon_energy_class || settings.iconEnergyClass,
      icon_sqft: settings.icon_sqft || settings.iconSqft,
      icon_living_space: settings.icon_living_space || settings.iconLivingSpace,
      google_maps_api_key: settings.google_maps_api_key || settings.googleMapsApiKey,
      xml_import_url: settings.xml_import_url || settings.xmlImportUrl,
      instagram_url: settings.instagram_url || settings.instagramUrl,
      youtube_url: settings.youtube_url || settings.youtubeUrl,
      facebook_url: settings.facebook_url || settings.facebookUrl,
      smtp_host: settings.smtp_host,
      smtp_port: settings.smtp_port ? String(settings.smtp_port) : undefined,
      smtp_username: settings.smtp_username,
      smtp_password: settings.smtp_password,
      smtp_from_email: settings.smtp_from_email,
      smtp_from_name: settings.smtp_from_name,
      smtp_secure: settings.smtp_secure,
      openai_api_key: settings.openai_api_key
    };
    
    const { data, error } = await supabase
      .from('agency_settings')
      .update(dbSettings)
      .eq('id', settings.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating agency settings:', error);
    return { success: false, error };
  }
}

export async function deleteAgencySettings(agencyId: string) {
  try {
    const { data, error } = await supabase
      .from('agency_settings')
      .delete()
      .eq('id', agencyId);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting agency settings:', error);
    return { success: false, error };
  }
}

// Export as a service object for compatibility
export const agencySettingsService = {
  getAgencySettings,
  createAgencySettings,
  updateAgencySettings,
  deleteAgencySettings,
  uploadLogo: async (file: Blob, filename: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('agency')
      .upload(`logos/${filename}`, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('agency')
      .getPublicUrl(data.path);
      
    return publicUrl;
  },
  uploadBackground: async (file: Blob, filename: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('agency')
      .upload(`backgrounds/${filename}`, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('agency')
      .getPublicUrl(data.path);
      
    return publicUrl;
  },
  updateSettings: async (id: string, settings: Partial<AgencySettings>): Promise<any> => {
    return updateAgencySettings({ ...settings, id } as AgencySettings);
  }
};
