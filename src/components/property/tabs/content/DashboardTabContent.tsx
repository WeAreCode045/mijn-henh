
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";
import { PropertyTabActionsHandler } from "../wrapper/PropertyTabActionsHandler";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete: () => Promise<void>;
  onSave: () => void;
  onWebView: (e: React.MouseEvent) => void;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleGeneratePDF: (e: React.MouseEvent) => void;
}

export function DashboardTabContent({
  property,
  onDelete,
  onSave,
  onWebView,
  handleSaveAgent,
  handleSaveObjectId,
  handleGeneratePDF
}: DashboardTabContentProps) {
  return (
    <PropertyTabActionsHandler
      propertyId={property.id}
      propertyData={property}
    >
      {({ handleGeneratePDF: handlePDF, handleOpenWebView }) => (
        <PropertyDashboardTab
          formData={property}
          propertyId={property.id}
          onDelete={onDelete}
          onSave={onSave}
        />
      )}
    </PropertyTabActionsHandler>
  );
}
