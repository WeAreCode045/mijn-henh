
import React from "react";
import { PropertyData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyImagesCard } from "./PropertyImagesCard";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";
import { usePropertyMediaHandlers } from "@/hooks/property/usePropertyMediaHandlers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaTabContentProps {
  property: PropertyData;
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

export function MediaTabContent({ property, handlers }: MediaTabContentProps) {
  const [activeTab, setActiveTab] = React.useState("images");
  const [localProperty, setLocalProperty] = React.useState<PropertyData>(property);
  const [isSaving, setIsSaving] = React.useState(false);

  // Update localProperty when property changes
  React.useEffect(() => {
    setLocalProperty(property);
  }, [property]);

  // Use custom hook for media handlers
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload,
    handleVirtualTourSave,
    handleYoutubeUrlSave,
    handleFloorplanEmbedScriptSave
  } = usePropertyMediaHandlers(localProperty, setLocalProperty, setIsSaving, handlers);

  // Prevent form submission for any forms in this component
  const preventFormSubmission = (e: React.FormEvent): false => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="space-y-6" onSubmit={preventFormSubmission}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
          <TabsTrigger value="virtual-tours">Virtual Tours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-6">
          <PropertyImagesCard 
            images={localProperty.images || []} 
            onImageUpload={handleImageUpload} 
            onRemoveImage={handleRemoveImage} 
            isUploading={isSaving}
            featuredImage={localProperty.featuredImage}
            featuredImages={localProperty.featuredImages || []}
            onSetFeaturedImage={handleSetFeaturedImage}
            onToggleFeaturedImage={handleToggleFeaturedImage}
            propertyId={localProperty.id}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-6">
          <FloorplansTab 
            property={localProperty} 
            setProperty={setLocalProperty} 
            preventFormSubmission={preventFormSubmission}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="space-y-6">
          <VirtualToursTab 
            property={localProperty} 
            setProperty={setLocalProperty}
            onVirtualTourSave={handleVirtualTourSave}
            onYoutubeUrlSave={handleYoutubeUrlSave}
            onFloorplanEmbedScriptSave={handleFloorplanEmbedScriptSave}
            preventFormSubmission={preventFormSubmission}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
