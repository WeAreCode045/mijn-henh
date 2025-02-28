
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { PropertyImage } from "@/types/property";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage
}: PropertyImagesCardProps) {
  // Create a file input ref to handle file selection
  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form submission
    e.preventDefault();
    
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      // Type assertion to safely convert Event to React.ChangeEvent<HTMLInputElement>
      if (e && e.target) {
        onImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Property Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Property Images ({images.length})</h3>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
                <p>No images have been added yet</p>
              </div>
            )}
          </div>
          
          <div>
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleUploadClick}
            >
              Upload Images
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
