
import { useState, useEffect } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { TabsContent } from "@/components/ui/tabs";
import { MediaTabNavigation } from "./MediaTabNavigation";
import { ImagesTab } from "./tabs/ImagesTab";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";
import { Tabs } from "@/components/ui/tabs";
import { MediaDatabaseFetcher } from "./MediaDatabaseFetcher";

interface MediaTabContentProps {
  property: PropertyData;
  handlers: {
    handleVirtualTourUpdate: (url: string) => void;
    handleYoutubeUrlUpdate: (url: string) => void;
    handleFloorplanEmbedScriptUpdate: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

type MediaTab = "images" | "floorplans" | "virtual-tours";

export function MediaTabContent({
  property,
  handlers
}: MediaTabContentProps) {
  const [currentTab, setCurrentTab] = useState<MediaTab>("images");
  const [isSaving, setIsSaving] = useState(false);
  const [localProperty, setLocalProperty] = useState<PropertyData>(property);
  
  // Update local state when property changes
  useEffect(() => {
    setLocalProperty(property);
    console.log("MediaTabContent - Updated with property:", {
      id: property.id,
      imagesCount: property.images?.length || 0
    });
  }, [property]);
  
  // When the tab changes, mark that there are pending changes
  const handleTabChange = (tab: MediaTab) => {
    setCurrentTab(tab);
    if (handlers.setPendingChanges) {
      handlers.setPendingChanges(true);
    }
  };
  
  // When new database images are fetched, update the local property state
  const handleImagesFetched = (images: PropertyImage[]) => {
    if (images.length > 0) {
      console.log("MediaTabContent - Received images from DB:", images.length);
      setLocalProperty(prev => ({
        ...prev,
        images: images
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media</h2>
      
      {/* Fetch media from database */}
      <MediaDatabaseFetcher
        propertyId={property.id}
        images={localProperty.images}
        onFetchComplete={handleImagesFetched}
      />
      
      <Tabs value={currentTab} onValueChange={handleTabChange as (value: string) => void}>
        <MediaTabNavigation currentTab={currentTab} />
        
        <TabsContent value="images" className="p-0 border-0">
          <ImagesTab
            property={localProperty}
            setProperty={setLocalProperty}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="p-0 border-0">
          <FloorplansTab
            property={localProperty}
            setProperty={setLocalProperty}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="p-0 border-0">
          <VirtualToursTab
            property={localProperty}
            setProperty={setLocalProperty}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
