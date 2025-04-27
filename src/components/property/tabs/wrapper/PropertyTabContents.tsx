import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { DashboardTabContent } from "../content/DashboardTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";
import { MediaTabContent } from "../media/MediaTabContent";
import { CommunicationsTabContent } from "../wrapper/CommunicationsTabContent";
import { PropertyData, PropertyFormData, PropertyFeature, PropertyArea, PropertyNearbyPlace, PropertyCity } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { transformFeatures, transformAreas, transformNearbyPlaces, transformImages } from "@/hooks/property-form/propertyDataTransformer";
import { ParticipantsTabContent } from "./ParticipantsTabContent";

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
  const [fullPropertyData, setFullPropertyData] = useState<PropertyData | null>(null);
  
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
          
          const propertyImages = Array.isArray(data.property_images) ? data.property_images : [];
          
          const featuresArray = Array.isArray(data.features) ? data.features : 
                              (typeof data.features === 'object' && data.features !== null ? [data.features] : []);
          
          const areasArray = Array.isArray(data.areas) ? data.areas : 
                          (typeof data.areas === 'object' && data.areas !== null ? [data.areas] : []);
          
          const nearbyPlacesArray = Array.isArray(data.nearby_places) ? data.nearby_places : 
                                  (typeof data.nearby_places === 'object' && data.nearby_places !== null ? [data.nearby_places] : []);
          
          const nearbyCitiesArray = Array.isArray(data.nearby_cities) ? data.nearby_cities : 
                                (typeof data.nearby_cities === 'object' && data.nearby_cities !== null ? [data.nearby_cities] : []);
          
          const transformedFeatures = transformFeatures(featuresArray);
          const transformedAreas = transformAreas(areasArray);
          const transformedNearbyPlaces = transformNearbyPlaces(nearbyPlacesArray);
          const transformedImages = transformImages(propertyImages);
          
          const transformedNearbyCities: PropertyCity[] = nearbyCitiesArray.map((city: any) => ({
            id: city.id || `city-${Date.now()}-${Math.random()}`,
            name: city.name || "Unknown City",
            distance: city.distance
          }));
          
          let transformedMetadata: { status?: string; [key: string]: unknown } = {};
          
          if (data.metadata) {
            if (typeof data.metadata === 'string') {
              try {
                transformedMetadata = JSON.parse(data.metadata);
              } catch (e) {
                console.warn("Failed to parse metadata string:", e);
                transformedMetadata = { status: data.status || 'Draft' };
              }
            } else if (typeof data.metadata === 'object' && data.metadata !== null) {
              transformedMetadata = data.metadata as Record<string, unknown>;
            }
          } else {
            transformedMetadata = { status: data.status || 'Draft' };
          }
          
          const transformedData: PropertyData = {
            ...data,
            images: transformedImages,
            features: transformedFeatures,
            areas: transformedAreas,
            nearby_places: transformedNearbyPlaces,
            nearby_cities: transformedNearbyCities,
            metadata: transformedMetadata
          };
          
          console.log("Transformed property data:", {
            featuresCount: transformedFeatures.length,
            areasCount: transformedAreas.length,
            placesCount: transformedNearbyPlaces.length,
            imagesCount: transformedImages.length,
            citiesCount: transformedNearbyCities.length,
            metadata: transformedMetadata
          });
          
          setFullPropertyData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };
    
    fetchPropertyData();
  }, [property]);
  
  const handleOpenWebView = (e: React.MouseEvent) => {
    console.log('PropertyTabContents: handleOpenWebView called for property', property.id);
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof handleWebView === 'function') {
      handleWebView(e);
    }
    return true;
  };

  const safeHandleSaveAgent = typeof handleSaveAgent === 'function' 
    ? handleSaveAgent 
    : async () => { console.warn("handleSaveAgent not provided in PropertyTabContents"); };
  
  const safeHandleSaveObjectId = typeof handleSaveObjectId === 'function'
    ? handleSaveObjectId
    : async () => { console.warn("handleSaveObjectId not provided in PropertyTabContents"); };

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
        <CommunicationsTabContent property={property} />
      </TabsContent>

      <TabsContent value="participants" className="mt-4 space-y-4">
        <ParticipantsTabContent property={property} />
      </TabsContent>
    </>
  );
}
