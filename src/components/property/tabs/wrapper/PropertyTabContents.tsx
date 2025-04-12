
import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "../content/DashboardTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyData, PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formData: PropertyFormData;
  handlers: any;
  onSave: () => void;
  onDelete: () => Promise<void>;
  handleSaveObjectId: (objectId: string) => Promise<void>;
  handleSaveAgent: (agentId: string) => Promise<void>;
  handleGeneratePDF: (e: React.MouseEvent) => void;
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
  const [webViewOpen, setWebViewOpen] = useState(false);
  const [fullPropertyData, setFullPropertyData] = useState<PropertyData | null>(null);
  
  // Fetch full property data when needed
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!property || !property.id) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*)
          `)
          .eq('id', property.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform property data to include images property
          const propertyImages = Array.isArray(data.property_images) ? data.property_images : [];
          
          // Create properly formatted PropertyData with images
          const transformedData: PropertyData = {
            ...data,
            images: propertyImages.map(img => ({
              id: img.id,
              url: img.url,
              property_id: img.property_id,
              is_main: img.is_main,
              is_featured_image: img.is_featured_image,
              type: img.type,
              area: img.area
            })),
            // Ensure other required properties are present
            features: Array.isArray(data.features) ? data.features : [],
            areas: Array.isArray(data.areas) ? data.areas : [],
            nearby_places: Array.isArray(data.nearby_places) ? data.nearby_places : []
          };
          
          setFullPropertyData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };
    
    fetchPropertyData();
  }, [property]);
  
  // Custom WebView handler that opens the modal
  const handleOpenWebView = (e: React.MouseEvent) => {
    console.log('PropertyTabContents: handleOpenWebView called for property', property.id);
    e.preventDefault();
    e.stopPropagation();
    setWebViewOpen(true);
    return true;
  };

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
          onWebView={handleOpenWebView}
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
          handleImageUpload={handlers.handleImageUpload}
          handleRemoveImage={handlers.handleRemoveImage}
          handleSetFeaturedImage={handlers.handleSetFeaturedImage}
          handleToggleFeaturedImage={handlers.handleToggleFeaturedImage}
          handleVirtualTourUpdate={handlers.handleVirtualTourUpdate}
          handleYoutubeUrlUpdate={handlers.handleYoutubeUrlUpdate}
          handleFloorplanEmbedScriptUpdate={handlers.handleFloorplanEmbedScriptUpdate}
          isUploading={isUpdating}
        />
      </TabsContent>
      
      <TabsContent value="communications" className="mt-4 space-y-4">
        <CommunicationsTabContent
          property={property}
        />
      </TabsContent>
      
      {/* Web View Modal Dialog - Only render when we have full property data with images */}
      {fullPropertyData && (
        <PropertyWebViewDialog
          propertyData={fullPropertyData}
          isOpen={webViewOpen}
          onOpenChange={setWebViewOpen}
        />
      )}
    </>
  );
}
