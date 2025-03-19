
export interface AgencySettings {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  description_background_url?: string;
  // Added properties
  pdfBackgroundUrl?: string;
  webviewBackgroundUrl?: string;
  iconBuildYear?: string;
  iconBedrooms?: string;
  iconBathrooms?: string;
  iconGarages?: string; 
  iconEnergyClass?: string;
  iconSqft?: string;
  iconLivingSpace?: string;
  googleMapsApiKey?: string;
  xmlImportUrl?: string;
  instagramUrl?: string; 
  youtubeUrl?: string;
  facebookUrl?: string;
  // SMTP settings
  smtp_host?: string;
  smtp_port?: string | number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  smtp_secure?: boolean;
  // API Keys
  openai_api_key?: string;
  // DB fields
  icon_build_year?: string;
  icon_bedrooms?: string; 
  icon_bathrooms?: string;
  icon_garages?: string;
  icon_energy_class?: string;
  icon_sqft?: string;
  icon_living_space?: string;
  google_maps_api_key?: string;
  xml_import_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  created_at?: string;
  updated_at?: string;
  agents?: any[];
}
