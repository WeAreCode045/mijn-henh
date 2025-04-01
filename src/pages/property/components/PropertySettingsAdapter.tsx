
import { Settings } from "@/types/settings";
import { AgencySettings } from "@/types/agency";

export function createAgencySettingsFromSettings(settings: Settings | null | undefined): AgencySettings {
  if (!settings) {
    return {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      primaryColor: "#40497A",
      secondaryColor: "#E2E8F0",
      logoUrl: "",
      webviewBgImage: "",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      globalFeatures: []
    };
  }

  // Ensure global_features is properly handled and converted to string[]
  let globalFeaturesList: string[] = [];
  
  if (settings.global_features) {
    if (Array.isArray(settings.global_features)) {
      // If it's already an array, use it
      globalFeaturesList = settings.global_features;
    } else if (typeof settings.global_features === 'string') {
      // If it's a JSON string, try to parse it
      try {
        const parsed = JSON.parse(settings.global_features);
        if (Array.isArray(parsed)) {
          globalFeaturesList = parsed;
        }
      } catch (e) {
        console.error('Error parsing global_features:', e);
      }
    }
  }

  return {
    id: "",
    name: settings.name || "",
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    primaryColor: settings.primary_color || "#40497A",
    secondaryColor: settings.secondary_color || "#E2E8F0",
    logoUrl: settings.logo_url || "",
    webviewBgImage: settings.description_background_url || "",
    facebookUrl: settings.facebook_url || "",
    instagramUrl: settings.instagram_url || "",
    youtubeUrl: settings.youtube_url || "",
    globalFeatures: globalFeaturesList,
    // IMAP settings
    imapHost: settings.imap_host || "",
    imapPort: settings.imap_port || "",
    imapUsername: settings.imap_username || "",
    imapPassword: settings.imap_password || "",
    imapTls: settings.imap_tls !== null ? settings.imap_tls : true,
    imapMailbox: settings.imap_mailbox || "INBOX",
  };
}
