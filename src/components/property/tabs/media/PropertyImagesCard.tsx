
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload, Star, Grid, X } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeaturedImage?: (url: string) => void;
  onToggleGridImage?: (url: string) => void;
  featuredImage?: string | null;
  gridImages?: string[];
  isUploading?: boolean;
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage,
  onSetFeaturedImage,
  onToggleGridImage,
  featuredImage,
  gridImages = [],
  isUploading = false
}: PropertyImagesCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Create a file input ref to handle file selection
  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form submission
    e.preventDefault();
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(e);
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    // Prevent any default form submission
    e.preventDefault();
    onRemoveImage(index);
  };

  const handleSetFeatured = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSetFeaturedImage) {
      onSetFeaturedImage(url);
    }
  };

  const handleToggleGrid = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleGridImage) {
      onToggleGridImage(url);
    }
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
                      className={`w-full h-24 object-cover rounded-md ${
                        featuredImage === image.url ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    />
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveImage(index, e)}
                        className="bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Image status badges */}
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                      <button
                        type="button"
                        onClick={(e) => handleSetFeatured(image.url, e)}
                        className={`p-1 rounded-full ${
                          featuredImage === image.url ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white'
                        }`}
                        title={featuredImage === image.url ? "Remove from featured" : "Set as featured"}
                      >
                        <Star size={14} />
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => handleToggleGrid(image.url, e)}
                        className={`p-1 rounded-full ${
                          gridImages.includes(image.url) ? 'bg-blue-400 text-black' : 'bg-black/50 text-white'
                        }`}
                        title={gridImages.includes(image.url) ? "Remove from grid" : "Add to grid"}
                      >
                        <Grid size={14} />
                      </button>
                    </div>
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
            <input 
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Images</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
