
import { AgencySettings } from "@/types/agency";

export const defaultAgencySettings: AgencySettings = {
  name: "",
  email: "",
  phone: "",
  address: "",
  primaryColor: "#40497A",
  secondaryColor: "#E2E8F0",
  webviewBgImage: "",
  iconBuildYear: "calendar",
  iconBedrooms: "bed",
  iconBathrooms: "bath",
  iconGarages: "car",
  iconEnergyClass: "zap",
  iconSqft: "ruler",
  iconLivingSpace: "home",
  googleMapsApiKey: "",
  xmlImportUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  facebookUrl: "",
  
  // Appwrite default settings
  appwrite_endpoint: "https://cloud.appwrite.io/v1",
  appwrite_project_id: "",
  appwrite_database_id: "",
  appwrite_properties_collection_id: "",
  appwrite_agents_collection_id: "",
  appwrite_templates_collection_id: "",
  appwrite_storage_bucket_id: ""
};
