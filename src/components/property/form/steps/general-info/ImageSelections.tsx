
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Image as ImageIcon, PencilIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ImageSelectionsProps {
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  onFeaturedImageSelect: (url: string | null) => void;
  onFeaturedImageToggle: (url: string) => void;
  propertyId?: string;
  maxFeaturedImages?: number;
}

export function ImageSelections({
  images,
  featuredImage,
  featuredImages = [],
  onFeaturedImageSelect,
  onFeaturedImageToggle,
  propertyId = "",
  maxFeaturedImages = 4
}: ImageSelectionsProps) {
  const [imageSelectOpen, setImageSelectOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<'main' | 'featured'>('main');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleOpenSelectFeatured = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectionType('featured');
    setSelectedImage(null);
    setImageSelectOpen(true);
  };
  
  const handleImageClick = (url: string) => {
    if (selectionType === 'main') {
      setSelectedImage(url);
    } else {
      // For featured images, toggle directly
      onFeaturedImageToggle(url);
    }
  };
  
  const handleCloseDialog = () => {
    setSelectedImage(null);
    setImageSelectOpen(false);
  };

  const navigateToMediaTab = () => {
    // Use the id from params if propertyId is not provided
    const idToUse = propertyId || id;
    if (idToUse) {
      navigate(`/property/${idToUse}/media`);
    }
  };
  
  const canAddMoreFeaturedImages = featuredImages.length < maxFeaturedImages;
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Image Selections</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={navigateToMediaTab}
          type="button"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit in Media Tab
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Image - Left Side */}
          <div className="md:w-1/2 space-y-3">
            <h3 className="text-md font-medium">Main Image</h3>
            <div className="h-64 flex-col gap-3 items-center">
              {featuredImage ? (
                <div className="relative w-full h-full border rounded-lg overflow-hidden">
                  <img 
                    src={featuredImage} 
                    alt="Main" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full border rounded-lg flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          {/* Featured Images - Right Side */}
          <div className="md:w-1/2 space-y-3">
            <h3 className="text-md font-medium">Featured Images (max {maxFeaturedImages})</h3>
            <div className="grid grid-cols-2 gap-3 h-64">
              {featuredImages.slice(0, 4).map((url, index) => (
                <div key={index} className="relative h-full border rounded-lg overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Featured ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* Empty slots or add button */}
              {Array.from({ length: Math.min(4 - featuredImages.length, 4) }).map((_, index) => (
                <div key={`empty-${index}`} className="h-full">
                  {index === 0 && canAddMoreFeaturedImages ? (
                    <Button 
                      onClick={handleOpenSelectFeatured}
                      className="h-full w-full flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800"
                      variant="outline"
                      type="button"
                    >
                      <ImageIcon className="h-8 w-8 mb-1" />
                      <span className="text-xs">Add</span>
                    </Button>
                  ) : (
                    <div className="h-full w-full border border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Image Selection Dialog - Only for Featured Images */}
        <Dialog open={imageSelectOpen} onOpenChange={setImageSelectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Featured Images</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 max-h-[60vh] overflow-y-auto p-2">
              {images.map((image, index) => {
                // Check if image is already in the featuredImages array
                const isSelected = featuredImages.includes(image.url);
                
                return (
                  <div 
                    key={image.id || index} 
                    className={`relative cursor-pointer h-[150px] border-2 rounded-lg overflow-hidden hover:border-blue-500 ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              
              {images.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500">
                  No images available. Please upload images in the Media tab first.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
