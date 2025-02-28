
import { Label } from "@/components/ui/label";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageSelectionsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
}

export function ImageSelections({ 
  formData, 
  onFieldChange, 
  handleSetFeaturedImage 
}: ImageSelectionsProps) {
  const handleRemoveFeaturedImage = () => {
    handleSetFeaturedImage(null);
  };

  const handleRemoveGridImage = (indexToRemove: number) => {
    const updatedGridImages = formData.gridImages.filter((_, index) => index !== indexToRemove);
    onFieldChange('gridImages', updatedGridImages);
  };

  const selectGridImage = () => {
    // Determine which grid images are already selected
    const currentGridImageIds = (formData.gridImages || []).map(url => 
      formData.images.find(img => img.url === url)?.id || ''
    ).filter(id => id !== '');

    return (
      <ImageSelectDialog
        images={formData.images || []}
        selectedImageIds={currentGridImageIds}
        onSelect={(imageIds) => {
          // Limit to 4 grid images
          const selectedImages = imageIds.slice(0, 4).map(id => {
            const image = formData.images.find(img => img.id === id);
            return image?.url;
          }).filter(Boolean) as string[];
          onFieldChange('gridImages', selectedImages);
        }}
        buttonText="Select Grid Images"
        maxSelect={4}
      />
    );
  };

  // Prepare an array of 4 items for grid display (fill with nulls if needed)
  const gridItems = [...(formData.gridImages || [])];
  while (gridItems.length < 4) {
    gridItems.push(null);
  }

  // Check if all grid slots are filled
  const isGridFull = formData.gridImages && formData.gridImages.length >= 4;

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Media Selection</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Image Column */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          
          {formData.featuredImage ? (
            <div className="relative group h-64 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={formData.featuredImage} 
                alt="Featured" 
                className="w-full h-full object-cover"
              />
              
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={handleRemoveFeaturedImage}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ImageSelectDialog
                        images={formData.images || []}
                        selectedImageIds={formData.featuredImage ? [formData.images.find(img => img.url === formData.featuredImage)?.id || ''] : []}
                        onSelect={(imageIds) => {
                          if (imageIds[0]) {
                            const selectedImage = formData.images.find(img => img.id === imageIds[0]);
                            handleSetFeaturedImage(selectedImage?.url || null);
                          }
                        }}
                        buttonText="Change"
                        buttonIcon={<Edit className="h-4 w-4" />}
                        maxSelect={1}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col justify-center items-center p-4">
              <div className="text-gray-500 text-center mb-4">
                <p>No featured image selected</p>
                <p className="text-sm">Select an image to feature as the main property image</p>
              </div>
              
              <ImageSelectDialog
                images={formData.images || []}
                selectedImageIds={[]}
                onSelect={(imageIds) => {
                  if (imageIds[0]) {
                    const selectedImage = formData.images.find(img => img.id === imageIds[0]);
                    handleSetFeaturedImage(selectedImage?.url || null);
                  }
                }}
                buttonText="Select Featured Image"
                maxSelect={1}
              />
            </div>
          )}
        </div>
        
        {/* Grid Images Column */}
        <div className="space-y-2">
          <Label>Grid Images (Max 4)</Label>
          
          <div className="grid grid-cols-2 gap-3 h-64">
            {gridItems.map((imageUrl, index) => (
              <div 
                key={index} 
                className={`relative group rounded-lg overflow-hidden border ${
                  imageUrl ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                {imageUrl ? (
                  <>
                    <img 
                      src={imageUrl}
                      alt={`Grid image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover actions for existing images */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleRemoveGridImage(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove image</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {selectGridImage()}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Change image</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                ) : (
                  // Empty grid cell
                  <div className="w-full h-full flex flex-col justify-center items-center p-2">
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center">Add Grid Image</span>
                    
                    {/* We don't need a hover state for empty cells, just make it clickable */}
                    <button 
                      className="absolute inset-0 w-full h-full opacity-0"
                      onClick={() => {
                        const dialog = document.querySelector('[data-dialog-id="select-grid-images"]') as HTMLElement;
                        if (dialog) {
                          dialog.click();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Show the "Select Grid Images" button only if there are fewer than 4 images */}
          {!isGridFull && (
            <div className="mt-2">
              {selectGridImage()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
