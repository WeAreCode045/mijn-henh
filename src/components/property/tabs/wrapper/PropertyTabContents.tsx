
import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "../content/DashboardTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyData, PropertyFormData, PropertyFeature, PropertyArea, PropertyNearbyPlace, PropertyCity } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { PropertyWebViewDialog } from "@/components/property/webview/PropertyWebViewDialog";
import { transformFeatures, transformAreas, transformNearbyPlaces, transformImages } from "@/hooks/property-form/propertyDataTransformer";

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
          console.log("Fetched property data:", data);
          
          // Transform property data to include images property
          const propertyImages = Array.isArray(data.property_images) ? data.property_images : [];
          
          // Safely handle features, areas, and nearby_places to ensure they're arrays before transforming
          const featuresArray = Array.isArray(data.features) ? data.features : 
                              (typeof data.features === 'object' && data.features !== null ? [data.features] : []);
          
          const areasArray = Array.isArray(data.areas) ? data.areas : 
                          (typeof data.areas === 'object' && data.areas !== null ? [data.areas] : []);
          
          const nearbyPlacesArray = Array.isArray(data.nearby_places) ? data.nearby_places : 
                                  (typeof data.nearby_places === 'object' && data.nearby_places !== null ? [data.nearby_places] : []);
          
          // Handle nearby_cities to ensure it's properly typed
          const nearbyCitiesArray = Array.isArray(data.nearby_cities) ? data.nearby_cities : 
                                (typeof data.nearby_cities === 'object' && data.nearby_cities !== null ? [data.nearby_cities] : []);
          
          // Transform fields using helper functions after ensuring they're arrays
          const transformedFeatures = transformFeatures(featuresArray);
          const transformedAreas = transformAreas(areasArray);
          const transformedNearbyPlaces = transformNearbyPlaces(nearbyPlacesArray);
          const transformedImages = transformImages(propertyImages);
          
          // Create properly formatted PropertyData with images
          const transformedData: PropertyData = {
            ...data,
            images: transformedImages,
            features: transformedFeatures,
            areas: transformedAreas,
            nearby_places: transformedNearbyPlaces,
            nearby_cities: nearbyCitiesArray as PropertyCity[],
            // Remove property_images as it's not part of the PropertyData type
            property_images: undefined
          };
          
          console.log("Transformed property data:", {
            featuresCount: transformedFeatures.length,
            areasCount: transformedAreas.length,
            placesCount: transformedNearbyPlaces.length,
            imagesCount: transformedImages.length,
            citiesCount: nearbyCitiesArray.length
          });
          
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
