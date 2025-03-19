
export interface AgencySettings {
  id?: string;
  name?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  currencySymbol?: string;
  backgroundImage?: string;
  showBranding?: boolean;
}
