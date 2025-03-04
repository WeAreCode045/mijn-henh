
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Image as ImageIcon } from "lucide-react";

interface ImageSelectionsProps {
  images: PropertyImage[];
  featuredImage: string | null;
  gridImages: string[];
  onFeaturedImageSelect: (url: string | null) => void;
  onGridImageToggle: (url: string) => void;
  maxGridImages?: number;
}

export function ImageSelections({
  images,
  featuredImage,
  gridImages = [],
  onFeaturedImageSelect,
  onGridImageToggle,
  maxGridImages = 4
}: ImageSelectionsProps) {
  const [imageSelectOpen, setImageSelectOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<'featured' | 'grid'>('featured');
  
  const handleOpenSelectFeatured = () => {
    setSelectionType('featured');
    setImageSelectOpen(true);
  };
  
  const handleOpenSelectGrid = () => {
    setSelectionType('grid');
    setImageSelectOpen(true);
  };
  
  const handleSelectImage = (url: string) => {
    if (selectionType === 'featured') {
      onFeaturedImageSelect(url);
    } else {
      onGridImageToggle(url);
    }
    setImageSelectOpen(false);
  };
  
  const canAddMoreGridImages = gridImages.length < maxGridImages;
  
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
                  onClick={() => onFeaturedImageSelect(null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-40 h-40 border rounded-lg flex items-center justify-center bg-gray-100">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <Button onClick={handleOpenSelectFeatured}>
              {featuredImage ? "Change" : "Select"} Featured Image
            </Button>
          </div>
        </div>
        
        {/* Grid Images Selection */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Grid Images (max {maxGridImages})</h3>
          <div className="flex flex-wrap gap-4">
            {gridImages.map((url, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Grid ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                  onClick={() => onGridImageToggle(url)}
                >
                  ✕
                </button>
              </div>
            ))}
            
            {canAddMoreGridImages && (
              <Button 
                onClick={handleOpenSelectGrid}
                className="h-24 w-24 flex flex-col items-center justify-center"
                variant="outline"
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
                {selectionType === 'featured' ? 'Select Featured Image' : 'Select Grid Image'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-2">
              {images.map((image, index) => {
                const isSelected = selectionType === 'featured' 
                  ? image.url === featuredImage
                  : gridImages.includes(image.url);
                
                return (
                  <div 
                    key={image.id || index} 
                    className={`relative cursor-pointer aspect-square border-2 rounded-lg overflow-hidden hover:border-blue-500 ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => handleSelectImage(image.url)}
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
