
export type SettingsTab = "agency" | "design" | "advanced" | "icons" | "global" | "mail";

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
  
  // Mailjet settings
  mailjet_api_key?: string | null;
  mailjet_api_secret?: string | null;
  mailjet_from_email?: string | null;
  mailjet_from_name?: string | null;
  
  // IMAP settings
  imap_host?: string | null;
  imap_port?: string | null;
  imap_username?: string | null;
  imap_password?: string | null;
  imap_tls?: boolean | null;
  imap_mailbox?: string | null;
  
  // OpenAI API key
  openai_api_key?: string | null;
  
  // Nylas settings - make sure these match the database column names exactly
  nylas_client_id?: string | null;
  nylas_client_secret?: string | null;
  nylas_access_token?: string | null;
  
  // Add property aliases to match AgencySettings expected properties
  primaryColor?: string;
  secondaryColor?: string;
  
  // Mailjet aliases
  mailjetApiKey?: string;
  mailjetApiSecret?: string;
  mailjetFromEmail?: string;
  mailjetFromName?: string;

  // IMAP aliases
  imapHost?: string;
  imapPort?: string;
  imapUsername?: string;
  imapPassword?: string;
  imapTls?: boolean;
  imapMailbox?: string;
}
