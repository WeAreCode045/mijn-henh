
export interface AgencySettings {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  pdfBackgroundUrl?: string;
  webviewBackgroundUrl?: string;
  webviewBgImage?: string;
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
  smtp_host?: string | null;
  smtp_port?: string | null;
  smtp_username?: string | null;
  smtp_password?: string | null;
  smtp_from_email?: string | null;
  smtp_from_name?: string | null;
  smtp_secure?: boolean | null;

  // Appwrite settings
  appwrite_endpoint?: string | null;
  appwrite_project_id?: string | null;
  appwrite_database_id?: string | null;
  appwrite_properties_collection_id?: string | null;
  appwrite_agents_collection_id?: string | null;
  appwrite_templates_collection_id?: string | null;
  appwrite_storage_bucket_id?: string | null;
}
