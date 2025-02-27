
import { ReactNode } from "react";
import { PropertyInformationCard } from "@/components/property/PropertyInformationCard";
import { PropertyData } from "@/types/property";
import { PropertyActions } from "@/components/property/PropertyActions";
import { AgentSelector } from "@/components/property/AgentSelector";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { Settings } from "@/types/settings";
import { AgencySettings } from "@/types/agency";

interface PropertyFormLayoutProps {
  children: ReactNode;
  title: string;
  propertyData: PropertyData;
  settings: Settings;
  isAdmin: boolean;
  agents: any[];
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  onDeleteProperty: () => Promise<void>;
  onSaveProperty: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  images: string[];
}

export function PropertyFormLayout({
  children,
  title,
  propertyData,
  settings,
  isAdmin,
  agents,
  selectedAgent,
  onAgentSelect,
  onDeleteProperty,
  onSaveProperty,
  onImageUpload,
  onRemoveImage,
  images
}: PropertyFormLayoutProps) {
  // Create an AgencySettings compatible object by mapping properties
  const agencySettings: AgencySettings = {
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

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-estate-800">
            {title}
          </h1>
        </div>

        {propertyData.id && (
          <PropertyInformationCard
            id={propertyData.id}
            objectId={propertyData.object_id}
          />
        )}

        <div className="flex gap-6">
          {children}
          <div className="w-80 shrink-0 space-y-6">
            {propertyData.id && (
              <PropertyActions
                property={propertyData}
                settings={agencySettings}
                onDelete={onDeleteProperty}
                onSave={onSaveProperty}
              />
            )}
            {isAdmin && (
              <AgentSelector
                agents={agents}
                selectedAgent={selectedAgent}
                onAgentSelect={onAgentSelect}
              />
            )}
            <PropertyMediaLibrary
              images={images}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
