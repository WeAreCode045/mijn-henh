import { AgencySettings } from "@/types/agency";

// Update the object to include Appwrite settings
export const defaultAgencySettings: AgencySettings = {
  name: "Your Agency",
  email: "",
  phone: "",
  address: "",
  primaryColor: "#1976d2",
  secondaryColor: "#f44336",
  appwrite_endpoint: "https://cloud.appwrite.io/v1",
  appwrite_project_id: "",
  appwrite_database_id: "",
  appwrite_collection_properties_id: "",
  appwrite_collection_agents_id: "",
  appwrite_collection_templates_id: "",
  appwrite_storage_bucket_id: ""
};
