
import React from "react";
import { PropertyData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyImagesCard } from "./PropertyImagesCard";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";

interface MediaTabContentProps {
  property: PropertyData;
}

export function MediaTabContent({ property }: MediaTabContentProps) {
  const [activeTab, setActiveTab] = React.useState("images");
  const [localProperty, setLocalProperty] = React.useState<PropertyData>(property);

  // Update localProperty when property changes
  React.useEffect(() => {
    setLocalProperty(property);
  }, [property]);

  // Handlers for image operations (these would typically be connected to API calls)
  const handleSetFeaturedImage = (url: string | null) => {
    setLocalProperty(prev => ({
      ...prev,
      featuredImage: url
    }));
    console.log("Set featured image:", url);
  };

  const handleToggleFeaturedImage = (url: string) => {
    setLocalProperty(prev => {
      const currentFeatured = prev.featuredImages || [];
      const isFeatured = currentFeatured.includes(url);
      
      const updatedFeatured = isFeatured
        ? currentFeatured.filter(img => img !== url)
        : [...currentFeatured, url];
        
      return {
        ...prev,
        featuredImages: updatedFeatured
      };
    });
    console.log("Toggle featured image:", url);
  };

  const handleRemoveImage = (index: number) => {
    console.log("Remove image at index:", index);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered");
  };

  return (
    <div className="space-y-6">
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
            isUploading={false}
            featuredImage={localProperty.featuredImage}
            featuredImages={localProperty.featuredImages}
            onSetFeaturedImage={handleSetFeaturedImage}
            onToggleFeaturedImage={handleToggleFeaturedImage}
            propertyId={localProperty.id}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-6">
          <FloorplansTab property={localProperty} setProperty={setLocalProperty} />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="space-y-6">
          <VirtualToursTab property={localProperty} setProperty={setLocalProperty} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
