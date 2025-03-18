
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Image as ImageIcon, PencilIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "@/utils/imageTypeConverters";

interface ImageSelectionsProps {
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: PropertyImage[];
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

  // Get image URLs from PropertyImage objects
  const featuredImageUrls = featuredImages.map(img => getImageUrl(img));
  
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
      <CardContent>
        {images.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Main Image</h3>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image) => (
                  <div 
                    key={image.id} 
                    className={`relative border-2 rounded overflow-hidden cursor-pointer ${
                      featuredImage === image.url ? 'border-primary' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => onFeaturedImageSelect(image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt="Property view" 
                      className="w-full h-24 object-cover"
                    />
                    {featuredImage === image.url && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Featured Images</h3>
                {images.length > 4 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleOpenSelectFeatured}
                    disabled={!canAddMoreFeaturedImages}
                    type="button"
                  >
                    View All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image) => {
                  const isInFeatured = featuredImageUrls.includes(image.url);
                  return (
                    <div 
                      key={image.id} 
                      className={`relative border-2 rounded overflow-hidden cursor-pointer ${
                        isInFeatured ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => onFeaturedImageToggle(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt="Property view" 
                        className="w-full h-24 object-cover"
                      />
                      {isInFeatured && (
                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No images uploaded yet</p>
          </div>
        )}
        
        <Dialog open={imageSelectOpen} onOpenChange={setImageSelectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectionType === 'main' ? 'Select Main Image' : 'Select Featured Images'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.map((image) => {
                const isSelected = selectionType === 'main' 
                  ? selectedImage === image.url 
                  : featuredImageUrls.includes(image.url);
                
                return (
                  <div 
                    key={image.id} 
                    className={`relative border-2 rounded overflow-hidden cursor-pointer ${
                      isSelected 
                        ? selectionType === 'main' ? 'border-primary' : 'border-blue-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt="Property view" 
                      className="w-full h-32 object-cover"
                    />
                    {isSelected && (
                      <div className={`absolute top-1 right-1 ${
                        selectionType === 'main' ? 'bg-primary' : 'bg-blue-500'
                      } rounded-full p-0.5`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCloseDialog} type="button">
                Cancel
              </Button>
              {selectionType === 'main' && (
                <Button 
                  onClick={() => {
                    if (selectedImage) {
                      onFeaturedImageSelect(selectedImage);
                    }
                    handleCloseDialog();
                  }}
                  disabled={!selectedImage}
                  type="button"
                >
                  Select
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
