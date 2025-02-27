
import { ReactNode } from "react";
import { PropertyData } from "@/types/property";
import { Settings } from "@/types/settings";
import { AgencySettings } from "@/types/agency";

// Import our new components
import { PropertyFormHeader } from "./components/PropertyFormHeader";
import { PropertyActionsPanel } from "./components/PropertyActionsPanel";
import { createAgencySettingsFromSettings } from "./components/PropertySettingsAdapter";

interface PropertyFormLayoutProps {
  children: ReactNode;
  title: string;
  propertyData: PropertyData;
  settings: Settings | null | undefined;
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
  // Safely convert settings to the format needed by PropertyActions
  const agencySettings: AgencySettings = createAgencySettingsFromSettings(settings);

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PropertyFormHeader 
          title={title} 
          propertyId={propertyData.id} 
          objectId={propertyData.object_id} 
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {children}
          </div>
          
          <div className="md:w-80 space-y-4">
            <PropertyActionsPanel
              propertyData={propertyData}
              agencySettings={agencySettings}
              isAdmin={isAdmin}
              agents={agents}
              selectedAgent={selectedAgent}
              onAgentSelect={onAgentSelect}
              onDeleteProperty={onDeleteProperty}
              onSaveProperty={onSaveProperty}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
              images={images}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
