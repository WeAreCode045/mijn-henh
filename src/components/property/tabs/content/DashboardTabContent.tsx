
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyDashboardTab } from "../dashboard/PropertyDashboardTab";

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
  console.log("DashboardTabContent - Property ID:", property.id);
  console.log("DashboardTabContent - onWebView is function:", typeof onWebView === 'function');
  console.log("DashboardTabContent - handleGeneratePDF is function:", typeof handleGeneratePDF === 'function');
  
  return (
    <PropertyDashboardTab
      formData={property}
      propertyId={property.id}
      onDelete={onDelete}
    />
  );
}
