export interface PropertyBase {
  id?: string;
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  description: string;
  location_description: string;
  object_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  // Add missing fields
  agent_id?: string;
  template_id?: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplanEmbedScript?: string;
}
