
import { useState } from "react";
import { PropertyActions } from "@/components/property/PropertyActions";
import { AgentSelector } from "@/components/property/AgentSelector";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

interface PropertyActionsPanelProps {
  propertyData: PropertyData;
  agencySettings: AgencySettings;
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

export function PropertyActionsPanel({
  propertyData,
  agencySettings,
  isAdmin,
  agents,
  selectedAgent,
  onAgentSelect,
  onDeleteProperty,
  onSaveProperty,
  onImageUpload,
  onRemoveImage,
  images
}: PropertyActionsPanelProps) {
  return (
    <div className="w-80 shrink-0 space-y-6">
      {propertyData.id && (
        <PropertyActions
          propertyId={propertyData.id}
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
  );
}
