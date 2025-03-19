
import { Settings } from "@/types/settings";
import { AgencySettings } from "@/types/agency";

export function createAgencySettingsFromSettings(settings: Settings | null | undefined): AgencySettings {
  if (!settings) {
    return {
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
    };
  }

  return {
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
  };
}
