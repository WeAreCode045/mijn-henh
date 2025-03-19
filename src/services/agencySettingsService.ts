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
    const { data, error } = await supabase
      .from('agency_settings')
      .insert(settings)
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
    // Convert smtp_port to string if it's a number
    const updatedSettings = {
      ...settings,
      smtp_port: settings.smtp_port ? String(settings.smtp_port) : undefined
    };
    
    const { data, error } = await supabase
      .from('agency_settings')
      .update(updatedSettings)
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
