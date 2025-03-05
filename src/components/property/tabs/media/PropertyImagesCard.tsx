
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { useState, useEffect, createRef } from "react";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { SortableImageItem } from "./images/SortableImageItem";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeatured?: (url: string) => void; 
  onToggleFeatured?: (url: string) => void;
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  isUploading?: boolean;
  propertyId?: string; // Add propertyId for database updates
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage,
  onSetFeatured,
  onToggleFeatured,
  featuredImageUrl,
  featuredImageUrls = [],
  isUploading = false,
  propertyId,
}: PropertyImagesCardProps) {
  const [uploading, setUploading] = useState(isUploading);
  const [sortableImages, setSortableImages] = useState<PropertyImage[]>(images);
  const fileInputRef = createRef<HTMLInputElement>();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  useEffect(() => {
    setSortableImages(images);
  }, [images]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    onImageUpload(e);
    // Reset the file input value
    e.target.value = '';
  };

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Add methods to handle main and featured image actions with preventDefault
  const handleSetFeatured = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onSetFeatured) {
      onSetFeatured(url);
    }
  };

  const handleToggleFeatured = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onToggleFeatured) {
      onToggleFeatured(url);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSortableImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sort_order in the database
        if (propertyId) {
          updateImageSortOrderInDatabase(newItems);
        }
        
        return newItems;
      });
    }
  };

  const updateImageSortOrderInDatabase = async (images: PropertyImage[]) => {
    if (!propertyId) return;
    
    try {
      // Update sort_order for each image
      const updates = images.map((image, index) => {
        return supabase
          .from('property_images')
          .update({ sort_order: index + 1 }) // 1-based index for sort_order
          .eq('id', image.id);
      });
      
      await Promise.all(updates);
      console.log('Image sort order updated in database');
    } catch (error) {
      console.error('Error updating image sort order:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={handleUploadClick}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          
          {sortableImages && sortableImages.length > 0 ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={sortableImages.map(image => image.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {sortableImages.map((image, index) => (
                    <SortableImageItem
                      key={image.id || index}
                      id={image.id}
                      url={image.url}
                      onRemove={() => onRemoveImage(index)}
                      isFeatured={image.url === featuredImageUrl}
                      onSetFeatured={(e) => handleSetFeatured(e, image.url)}
                      isInFeatured={featuredImageUrls.includes(image.url)}
                      onToggleFeatured={(e) => handleToggleFeatured(e, image.url)}
                      sort_order={image.sort_order}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              No images uploaded yet. Click "Upload Images" to add images.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
