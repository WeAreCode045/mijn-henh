
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Image as ImageIcon } from "lucide-react";

interface ImageSelectionsProps {
  images: PropertyImage[];
  featuredImage: string | null;
  coverImages: string[];
  onFeaturedImageSelect: (url: string | null) => void;
  onCoverImageToggle: (url: string) => void;
  maxCoverImages?: number;
}

export function ImageSelections({
  images,
  featuredImage,
  coverImages = [],
  onFeaturedImageSelect,
  onCoverImageToggle,
  maxCoverImages = 4
}: ImageSelectionsProps) {
  const [imageSelectOpen, setImageSelectOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<'featured' | 'cover'>('featured');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleOpenSelectFeatured = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectionType('featured');
    setSelectedImage(featuredImage);
    setImageSelectOpen(true);
  };
  
  const handleOpenSelectCover = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectionType('cover');
    setSelectedImage(null);
    setImageSelectOpen(true);
  };
  
  const handleImageClick = (url: string) => {
    if (selectionType === 'featured') {
      setSelectedImage(url);
    } else {
      // For cover images, toggle directly
      onCoverImageToggle(url);
    }
  };
  
  const handleConfirmSelection = () => {
    if (selectionType === 'featured' && selectedImage !== undefined) {
      console.log("Confirming featured image selection:", selectedImage);
      onFeaturedImageSelect(selectedImage);
    }
    setImageSelectOpen(false);
  };
  
  const handleCloseDialog = () => {
    setSelectedImage(null);
    setImageSelectOpen(false);
  };
  
  const canAddMoreCoverImages = coverImages.length < maxCoverImages;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Image Selections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Image Selection */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Featured Image</h3>
          <div className="flex items-start gap-4">
            {featuredImage ? (
              <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    onFeaturedImageSelect(null);
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-40 h-40 border rounded-lg flex items-center justify-center bg-gray-100">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <Button 
              onClick={handleOpenSelectFeatured} 
              type="button"
              className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800"
            >
              {featuredImage ? "Change" : "Select"} Featured Image
            </Button>
          </div>
        </div>
        
        {/* Cover Images Selection - Renamed from Grid Images */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Cover Images (max {maxCoverImages})</h3>
          <div className="flex flex-wrap gap-4">
            {coverImages.map((url, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Cover ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    onCoverImageToggle(url);
                  }}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {canAddMoreCoverImages && (
              <Button 
                onClick={handleOpenSelectCover}
                className="h-24 w-24 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800"
                variant="outline"
                type="button"
              >
                <ImageIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">Add</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Image Selection Dialog */}
        <Dialog open={imageSelectOpen} onOpenChange={setImageSelectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectionType === 'featured' ? 'Select Featured Image' : 'Select Cover Image'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 max-h-[60vh] overflow-y-auto p-2">
              {images.map((image, index) => {
                // For featured images, check against the temporary selectedImage state
                // For cover images, check if it's already in the coverImages array
                const isSelected = selectionType === 'featured' 
                  ? image.url === selectedImage
                  : coverImages.includes(image.url);
                
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
            
            {selectionType === 'featured' && (
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSelection}>
                  Confirm Selection
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
