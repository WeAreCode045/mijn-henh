
import { Settings } from "@/types/settings";
import { AgencySettings } from "@/types/agency";

export function createAgencySettingsFromSettings(settings: Settings): AgencySettings {
  return {
    name: settings.name,
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    primaryColor: settings.primary_color || "#40497A",
    secondaryColor: settings.secondary_color || "#E2E8F0",
    logoUrl: settings.logo_url,
    webviewBackgroundUrl: settings.description_background_url,
    instagramUrl: settings.instagram_url,
    youtubeUrl: settings.youtube_url,
    facebookUrl: settings.facebook_url,
    iconBuildYear: settings.icon_build_year,
    iconBedrooms: settings.icon_bedrooms,
    iconBathrooms: settings.icon_bathrooms,
    iconGarages: settings.icon_garages,
    iconEnergyClass: settings.icon_energy_class,
    iconSqft: settings.icon_sqft,
    iconLivingSpace: settings.icon_living_space,
    googleMapsApiKey: settings.google_maps_api_key,
    xmlImportUrl: settings.xml_import_url
  };
}
