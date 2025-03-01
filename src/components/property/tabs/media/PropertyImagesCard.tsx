
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload, Star, Grid, X } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    // Prevent default actions and propagation
    e.preventDefault();
    e.stopPropagation();
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(e);
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    // Prevent default actions and propagation
    e.preventDefault();
    e.stopPropagation();
    onRemoveImage(index);
  };

  const handleSetFeatured = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSetFeaturedImage) {
      onSetFeaturedImage(url);
    }
  };

  const handleToggleGrid = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
                      } ${
                        gridImages.includes(image.url) ? 'ring-1 ring-blue-400' : ''
                      }`}
                    />
                    
                    {/* Indicator badges */}
                    <div className="absolute top-1 left-1 flex gap-1">
                      {featuredImage === image.url && (
                        <Badge variant="outline" className="bg-yellow-400 text-black text-xs">
                          <Star className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      )}
                      {gridImages.includes(image.url) && (
                        <Badge variant="outline" className="bg-blue-400 text-black text-xs">
                          <Grid className="h-3 w-3 mr-1" /> Grid
                        </Badge>
                      )}
                    </div>
                    
                    {/* Delete button */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleRemoveImage(index, e)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    
                    {/* Image action buttons */}
                    <div className="absolute bottom-0 left-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between bg-black/50">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className={`h-6 w-6 ${
                                featuredImage === image.url ? 'text-yellow-400' : 'text-white'
                              }`}
                              onClick={(e) => handleSetFeatured(image.url, e)}
                            >
                              <Star size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {featuredImage === image.url ? "Remove featured" : "Set as featured"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className={`h-6 w-6 ${
                                gridImages.includes(image.url) ? 'text-blue-400' : 'text-white'
                              } ${
                                gridImages.length >= 4 && !gridImages.includes(image.url) ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={(e) => handleToggleGrid(image.url, e)}
                              disabled={gridImages.length >= 4 && !gridImages.includes(image.url)}
                            >
                              <Grid size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {gridImages.includes(image.url) ? "Remove from grid" : "Add to grid"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
