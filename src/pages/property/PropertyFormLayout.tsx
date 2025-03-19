
import React from "react";
import { PropertyActionsPanel } from "../components/PropertyActionsPanel";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

interface PropertyFormLayoutProps {
  children: React.ReactNode;
  title: string;
  propertyData: PropertyData;
  settings: AgencySettings;
  isAdmin: boolean;
  agents: any[];
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  onDeleteProperty: () => Promise<void>;
  onSaveProperty: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  images: string[];
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
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
  images,
  agentInfo,
  templateInfo
}: PropertyFormLayoutProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 h-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {children}
        </div>

        <PropertyActionsPanel
          propertyData={propertyData}
          agencySettings={settings}
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
  );
}
