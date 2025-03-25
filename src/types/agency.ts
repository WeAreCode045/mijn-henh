
import { Settings } from "@/types/settings";

// Agency settings interface - extends the Settings type
export interface AgencySettings extends Settings {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  descriptionBackgroundUrl?: string;
  pdfBackgroundUrl?: string;
  webviewBackgroundUrl?: string;
  webviewBgImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  googleMapsApiKey?: string;
  xmlImportUrl?: string;
  iconBedrooms?: string;
  iconBathrooms?: string;
  iconSqft?: string;
  iconLivingSpace?: string;
  iconBuildYear?: string;
  iconGarages?: string;
  iconEnergyClass?: string;
  globalFeatures?: string[];
  
  // SMTP settings
  smtpHost?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  smtpSecure?: boolean;
  
  // OpenAI API key
  openaiApiKey?: string;
}

// Default settings
export const DEFAULT_ICON_BUILD_YEAR = 'calendar';
export const DEFAULT_ICON_BEDROOMS = 'bed';
export const DEFAULT_ICON_BATHROOMS = 'bath';
export const DEFAULT_ICON_SQFT = 'ruler';
export const DEFAULT_ICON_LIVING_SPACE = 'home';
export const DEFAULT_ICON_GARAGES = 'car';
export const DEFAULT_ICON_ENERGY_CLASS = 'zap';
