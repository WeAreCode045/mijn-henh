
import { Settings } from "@/types/settings";

export function createAgencySettingsFromSettings(settings: Settings | null | undefined) {
  if (!settings) {
    return {
      logo_url: "",
      name: "",
      primary_color: "#40497A",
      secondary_color: "#E2E8F0",
      background_image: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
    };
  }

  return {
    logo_url: settings.logo_url || "",
    name: settings.name || "",
    primary_color: settings.primary_color || "#40497A",
    secondary_color: settings.secondary_color || "#E2E8F0",
    background_image: settings.description_background_url || "",
    description: settings.description || "",
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    facebook_url: settings.facebook_url || "",
    instagram_url: settings.instagram_url || "",
    youtube_url: settings.youtube_url || "",
  };
}
