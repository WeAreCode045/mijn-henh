
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "../content/DashboardTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyData, PropertyFormData } from "@/types/property";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formData: PropertyFormData;
  handlers: any;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleGeneratePDF: () => void;
  handleWebView: (e: React.MouseEvent) => void;
  isUpdating: boolean;
  agentInfo?: { id: string; name: string } | null;
}

export function PropertyTabContents({
  activeTab,
  property,
  formData,
  handlers,
  onSave,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleGeneratePDF,
  handleWebView,
  isUpdating,
  agentInfo
}: PropertyTabContentsProps) {
  // Provide fallbacks for required handler functions
  const safeHandleSaveAgent = typeof handleSaveAgent === 'function' 
    ? handleSaveAgent 
    : async () => { console.warn("handleSaveAgent not provided in PropertyTabContents"); };
  
  const safeHandleSaveObjectId = typeof handleSaveObjectId === 'function'
    ? handleSaveObjectId
    : async () => { console.warn("handleSaveObjectId not provided in PropertyTabContents"); };

  // Ensure we have handlers.currentStep and handlers.handleStepClick
  const safeHandlers = {
    ...handlers,
    currentStep: handlers?.currentStep !== undefined ? handlers.currentStep : 0,
    handleStepClick: typeof handlers?.handleStepClick === 'function' 
      ? handlers.handleStepClick 
      : (step: number) => { console.log(`Step click handler called with ${step}, fallback used in PropertyTabContents`); }
  };

  return (
    <>
      <TabsContent value="dashboard" className="mt-4 space-y-4">
        <DashboardTabContent
          property={property}
          onDelete={onDelete}
          onSave={onSave}
          onWebView={handleWebView}
          handleSaveAgent={safeHandleSaveAgent}
          handleSaveObjectId={safeHandleSaveObjectId}
          handleGeneratePDF={handleGeneratePDF}
        />
      </TabsContent>
      
      <TabsContent value="content" className="mt-4 space-y-4">
        <ContentTabWrapper
          property={property}
          formData={formData}
          handlers={safeHandlers}
          currentStep={safeHandlers.currentStep}
          handleStepClick={safeHandlers.handleStepClick}
          handleSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="media" className="mt-4 space-y-4">
        <MediaTabContent
          property={property}
        />
      </TabsContent>
      
      <TabsContent value="communications" className="mt-4 space-y-4">
        <CommunicationsTabContent
          property={property}
        />
      </TabsContent>
    </>
  );
}
