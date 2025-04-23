
import React, { useState } from "react";
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
  
  // Provide a fallback for handleSaveAgent if it's undefined
  const safeHandleSaveAgent = typeof handleSaveAgent === 'function' 
    ? handleSaveAgent 
    : async () => { console.warn("handleSaveAgent not provided"); };
    
  // Handle for web view that opens in a new tab
  const handleOpenWebView = (e: React.MouseEvent) => {
    console.log("DashboardTabContent - handleOpenWebView called");
    
    // Call the original handler which now opens in a new tab
    if (typeof onWebView === 'function') {
      onWebView(e);
    }
    
    return true;
  };

  return (
    <PropertyDashboardTab
      id={property.id}
      title={property.title}
      objectId={property.object_id}
      agentId={property.agent_id}
      createdAt={property.created_at}
      updatedAt={property.updated_at}
      agentInfo={property.agent ? { id: property.agent.id, name: property.agent.name } : null}
      isUpdating={false}
      onSave={onSave}
      onDelete={onDelete}
      handleSaveObjectId={handleSaveObjectId}
      handleSaveAgent={safeHandleSaveAgent}
      handleGeneratePDF={handleGeneratePDF}
      handleWebView={handleOpenWebView}
      virtualTourUrl={property.virtualTourUrl}
      youtubeUrl={property.youtubeUrl}
    />
  );
}
