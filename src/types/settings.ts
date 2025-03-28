
export type SettingsTab = "agency" | "design" | "advanced" | "icons" | "global";

export interface Settings {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  description_background_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  google_maps_api_key?: string | null;
  xml_import_url?: string | null;
  icon_bedrooms?: string | null;
  icon_bathrooms?: string | null;
  icon_sqft?: string | null;
  icon_living_space?: string | null;
  icon_build_year?: string | null;
  icon_garages?: string | null;
  icon_energy_class?: string | null;
  global_features?: string[] | null;
  
  // SMTP settings
  smtp_host?: string | null;
  smtp_port?: string | null;
  smtp_username?: string | null;
  smtp_password?: string | null;
  smtp_from_email?: string | null;
  smtp_from_name?: string | null;
  smtp_secure?: boolean | null;
  
  // OpenAI API key
  openai_api_key?: string | null;
  
  // Add property aliases to match AgencySettings expected properties
  primaryColor?: string;
  secondaryColor?: string;
}
