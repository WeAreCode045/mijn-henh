
export interface Agency {
  id: string;
  created_at: string;
  name: string;
  website: string;
  user_id: string;
}

export interface AgencySettings {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  icon_bedrooms?: string;
  icon_bathrooms?: string;
  icon_sqft?: string;
  icon_garages?: string;
  icon_build_year?: string;
  icon_living_space?: string;
  icon_energy_class?: string;
  description_background_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  xml_import_url?: string; 
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  smtp_secure?: boolean;
  imap_host?: string;
  imap_port?: string;
  imap_username?: string;
  imap_password?: string;
  imap_tls?: boolean;
  imap_mailbox?: string;
  mailjet_api_key?: string;
  mailjet_api_secret?: string;
  mailjet_from_email?: string;
  mailjet_from_name?: string;
  google_maps_api_key?: string;
  openai_api_key?: string;
  global_features?: any[];
  nylas_client_id?: string;
  nylas_client_secret?: string;
  nylas_access_token?: string;
  
  // Camel case aliases for consistency in code
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  iconBedrooms?: string;
  iconBathrooms?: string;
  iconSqft?: string;
  iconGarages?: string;
  iconBuildYear?: string;
  iconLivingSpace?: string;
  iconEnergyClass?: string;
  descriptionBackgroundUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  xmlImportUrl?: string;
  googleMapsApiKey?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  smtpSecure?: boolean;
  imapHost?: string;
  imapPort?: string;
  imapUsername?: string;
  imapPassword?: string;
  imapTls?: boolean;
  imapMailbox?: string;
  mailjetApiKey?: string;
  mailjetApiSecret?: string;
  mailjetFromEmail?: string;
  mailjetFromName?: string;
  openaiApiKey?: string;
  nylasClientId?: string;
  nylasClientSecret?: string;
  nylasAccessToken?: string;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  email: string;
  phone?: string;
  properties?: any[];
  agency_id?: string | null;
}
