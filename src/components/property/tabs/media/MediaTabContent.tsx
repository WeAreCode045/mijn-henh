
import React, { useState } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { VirtualTourCard } from "./VirtualTourCard";
import { SortableImageGrid } from "./images/SortableImageGrid";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { usePropertyImageHandlers } from "@/hooks/property/media/usePropertyImageHandlers";

interface MediaTabContentProps {
  property: PropertyData;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  isUploading?: boolean;
  isReadOnly?: boolean;
}

export function MediaTabContent({ 
  property,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  handleImageUpload,
  handleRemoveImage,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading = false,
  isReadOnly = false
}: MediaTabContentProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // If no handlers are provided, create them using our hook
  const {
    handleSetFeaturedImage: defaultSetFeaturedImage,
    handleToggleFeaturedImage: defaultToggleFeaturedImage,
    handleRemoveImage: defaultRemoveImage,
    handleImageUpload: defaultImageUpload
  } = usePropertyImageHandlers(property, ((newState) => {}), setIsSaving, {});

  // Use provided handlers or fall back to default handlers
  const onSetFeaturedImage = handleSetFeaturedImage || defaultSetFeaturedImage;
  const onToggleFeaturedImage = handleToggleFeaturedImage || defaultToggleFeaturedImage;
  const onRemoveImage = handleRemoveImage || defaultRemoveImage;
  const onImageUpload = handleImageUpload || defaultImageUpload;

  // Create default handlers for other functions if none are provided
  const onVirtualTourUpdate = handleVirtualTourUpdate || ((url: string) => {
    console.log("Virtual tour URL update not implemented:", url);
  });
  
  const onYoutubeUrlUpdate = handleYoutubeUrlUpdate || ((url: string) => {
    console.log("YouTube URL update not implemented:", url);
  });
  
  const onFloorplanEmbedScriptUpdate = handleFloorplanEmbedScriptUpdate || ((script: string) => {
    console.log("Floorplan embed script update not implemented:", script);
  });

  // Ensure property.images is an array of PropertyImage objects
  const normalizedImages = React.useMemo(() => {
    if (!property.images || !Array.isArray(property.images)) return [];
    
    return property.images.map((img: any) => {
      if (typeof img === 'string') {
        return { id: img, url: img };
      } else if (typeof img === 'object' && img.url) {
        return { id: img.id || img.url, url: img.url };
      }
      return img;
    }) as PropertyImage[];
  }, [property.images]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Media</h2>
      
      {/* Property Images Section - Always display */}
      <section className="mb-8">
        <h3 className="text-lg font-medium mb-4">Property Images</h3>
        <div className="bg-white p-4 rounded-lg border">
          {normalizedImages.length > 0 ? (
            <>
              <SortableImageGrid 
                images={normalizedImages}
                onRemoveImage={onRemoveImage}
                onSetFeaturedImage={onSetFeaturedImage}
                onToggleFeaturedImage={onToggleFeaturedImage}
                featuredImage={property.featuredImage}
                featuredImages={property.featuredImages || []}
                propertyId={property.id || ""}
              />
              
              {!isReadOnly && (
                <div className="mt-4">
                  <ImageUploader
                    onUpload={onImageUpload}
                    isUploading={isUploading || isSaving}
                    label="Add More Images"
                    multiple={true}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No images uploaded yet</p>
              
              {!isReadOnly && (
                <div>
                  <ImageUploader
                    onUpload={onImageUpload}
                    isUploading={isUploading || isSaving}
                    label="Upload Images"
                    multiple={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <div className="grid gap-6">
        <VirtualTourCard
          virtualTourUrl={property.virtualTourUrl || ""}
          youtubeUrl={property.youtubeUrl || ""}
          onVirtualTourUpdate={onVirtualTourUpdate}
          onYoutubeUrlUpdate={onYoutubeUrlUpdate}
          isReadOnly={isReadOnly}
        />
        
        {/* Additional media cards can go here */}
        
        {property.floorplanEmbedScript && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Floorplan Embed</h3>
            <div className="bg-muted p-4 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
