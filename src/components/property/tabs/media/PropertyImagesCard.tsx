
import React from "react";
import { PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isUploading?: boolean;
  featuredImage?: string | null;
  featuredImages?: string[];
  onSetFeaturedImage?: (url: string | null) => void;
  onToggleFeaturedImage?: (url: string) => void;
  propertyId?: string;
  isReadOnly?: boolean;
}

export function PropertyImagesCard({
  images,
  onImageUpload,
  onRemoveImage,
  isUploading,
  featuredImage,
  featuredImages = [],
  onSetFeaturedImage,
  onToggleFeaturedImage,
  propertyId,
  isReadOnly = false
}: PropertyImagesCardProps) {
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveImage(index);
  };

  const handleSetFeaturedImage = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSetFeaturedImage) {
      onSetFeaturedImage(url);
    }
  };

  const handleToggleFeaturedImage = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFeaturedImage) {
      onToggleFeaturedImage(url);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Images</CardTitle>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => {
              const isMain = featuredImage === image.url;
              const isFeatured = featuredImages.includes(image.url);
              
              return (
                <div 
                  key={image.id || index} 
                  className={cn(
                    "relative group aspect-square overflow-hidden rounded-md border",
                    isMain ? "ring-2 ring-primary" : "",
                    isFeatured ? "ring-1 ring-blue-400" : ""
                  )}
                >
                  <img 
                    src={image.url} 
                    alt={`Property image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  
                  {!isReadOnly && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        className="h-8 w-8" 
                        variant="default" 
                        size="icon"
                        onClick={(e) => handleSetFeaturedImage(image.url, e)}
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        className="h-8 w-8" 
                        variant="secondary" 
                        size="icon"
                        onClick={(e) => handleToggleFeaturedImage(image.url, e)}
                        title={isFeatured ? "Remove from featured" : "Add to featured"}
                      >
                        {isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </Button>
                      
                      <Button 
                        className="h-8 w-8" 
                        variant="destructive" 
                        size="icon" 
                        onClick={(e) => handleRemoveImage(index, e)}
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {isMain && (
                    <div className="absolute top-1 right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                      Main
                    </div>
                  )}
                  
                  {isFeatured && !isMain && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                      Featured
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-2">No images uploaded yet</p>
          </div>
        )}
        
        {!isReadOnly && (
          <div className="mt-4">
            <label className="cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={onImageUpload}
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isUploading}
                type="button"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Images"}
              </Button>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
