
import { ReactNode } from "react";
import { PropertyInformationCard } from "@/components/property/PropertyInformationCard";
import { PropertyData } from "@/types/property";
import { PropertyActions } from "@/components/property/PropertyActions";
import { AgentSelector } from "@/components/property/AgentSelector";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { Settings } from "@/types/settings";

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
                settings={settings}
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
