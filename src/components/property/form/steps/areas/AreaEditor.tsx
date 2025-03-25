import React, { useState, useEffect } from "react";
import { PropertyArea } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaImagesUpload } from "./AreaImagesUpload";
import { Button } from "@/components/ui/button";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";

interface AreaEditorProps {
  area: PropertyArea;
  onUpdate: (field: string, value: any) => void;
  onAreaImageRemove?: (imageId: string) => void;
  onAreaImageUpload?: (files: FileList) => Promise<void>;
  onAreaImagesSelect?: (imageIds: string[]) => void;
  propertyImages?: { id: string; url: string }[];
  isUploading?: boolean;
}

export function AreaEditor({
  area,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  onAreaImagesSelect,
  propertyImages = [],
  isUploading = false
}: AreaEditorProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  useEffect(() => {
    if (area.title && area.title !== area.name) {
      onUpdate("name", area.title);
    }
  }, [area.title, area.name, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate(name, value);
    
    if (name === "name") {
      onUpdate("title", value);
    }
  };

  const handleImagesSelect = (selectedIds: string[]) => {
    if (onAreaImagesSelect) {
      onAreaImagesSelect(selectedIds);
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor={`area-name-${area.id}`}>Name</Label>
            <Input
              id={`area-name-${area.id}`}
              name="name"
              value={area.name || area.title || ''}
              onChange={handleInputChange}
              placeholder="Area name (e.g. Living Room, Kitchen)"
            />
          </div>
          
          <div>
            <Label htmlFor={`area-description-${area.id}`}>Description</Label>
            <Textarea
              id={`area-description-${area.id}`}
              name="description"
              value={area.description || ''}
              onChange={handleInputChange}
              placeholder="Describe this area..."
              rows={5}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="images">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setIsSelectDialogOpen(true)}
              className="w-full"
            >
              Select Images from Media Library
            </Button>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {area.images && area.images.length > 0 ? (
                (area.images as any[]).map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={typeof image === 'string' ? image : image.url} 
                      alt={`Area image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {onAreaImageRemove && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                        onClick={() => onAreaImageRemove(typeof image === 'string' ? image : image.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 border border-dashed rounded-md">
                  No images selected. Click "Select Images" to add images from the media library.
                </div>
              )}
            </div>
          </div>
          
          <ImageSelectDialog
            images={propertyImages}
            selectedImageIds={area.imageIds || []}
            onSelect={handleImagesSelect}
            buttonText=""
            open={isSelectDialogOpen}
            onOpenChange={setIsSelectDialogOpen}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
