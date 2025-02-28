
import { Label } from "@/components/ui/label";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GridImagesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GridImagesSection({ 
  formData, 
  onFieldChange 
}: GridImagesSectionProps) {
  const handleRemoveGridImage = (indexToRemove: number) => {
    const updatedGridImages = formData.gridImages.filter((_, index) => index !== indexToRemove);
    onFieldChange('gridImages', updatedGridImages);
  };

  // Prepare an array of 4 items for grid display (fill with nulls if needed)
  const gridItems = [...(formData.gridImages || [])];
  while (gridItems.length < 4) {
    gridItems.push(null);
  }

  // Check if all grid slots are filled
  const isGridFull = formData.gridImages && formData.gridImages.length >= 4;

  return (
    <div className="space-y-2">
      <Label>Grid Images (Max 4)</Label>
      
      <div className="grid grid-cols-2 gap-3 h-64">
        {gridItems.map((imageUrl, index) => (
          <GridImageItem 
            key={index}
            imageUrl={imageUrl}
            index={index}
            formData={formData}
            onFieldChange={onFieldChange}
            handleRemoveGridImage={handleRemoveGridImage}
            isGridFull={isGridFull}
          />
        ))}
      </div>
      
      {/* Show a select button below the grid only if not full */}
      {!isGridFull && (
        <div className="mt-2 flex justify-center">
          <ImageSelectDialog
            images={formData.images || []}
            selectedImageIds={(formData.gridImages || []).map(url => 
              formData.images.find(img => img.url === url)?.id || ''
            ).filter(id => id !== '')}
            onSelect={(imageIds) => {
              const selectedImages = imageIds.slice(0, 4).map(id => {
                const image = formData.images.find(img => img.id === id);
                return image?.url;
              }).filter(Boolean) as string[];
              onFieldChange('gridImages', selectedImages);
            }}
            buttonText="Select Grid Images"
            maxSelect={4}
          />
        </div>
      )}
    </div>
  );
}

interface GridImageItemProps {
  imageUrl: string | null;
  index: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleRemoveGridImage: (index: number) => void;
  isGridFull: boolean;
}

function GridImageItem({
  imageUrl,
  index,
  formData,
  onFieldChange,
  handleRemoveGridImage,
  isGridFull
}: GridImageItemProps) {
  return (
    <div 
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
                  <ImageSelectDialog
                    images={formData.images || []}
                    selectedImageIds={(formData.gridImages || []).map(url => 
                      formData.images.find(img => img.url === url)?.id || ''
                    ).filter(id => id !== '')}
                    onSelect={(imageIds) => {
                      const selectedImages = imageIds.slice(0, 4).map(id => {
                        const image = formData.images.find(img => img.id === id);
                        return image?.url;
                      }).filter(Boolean) as string[];
                      onFieldChange('gridImages', selectedImages);
                    }}
                    buttonText=""
                    buttonIcon={<Edit className="h-4 w-4" />}
                    maxSelect={4}
                  />
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
              if (!isGridFull) {
                // Open the image selection dialog for this empty slot
                document.getElementById(`grid-select-button-${index}`)?.click();
              }
            }}
          />
          <div className="hidden">
            <ImageSelectDialog
              id={`grid-select-button-${index}`}
              images={formData.images || []}
              selectedImageIds={(formData.gridImages || []).map(url => 
                formData.images.find(img => img.url === url)?.id || ''
              ).filter(id => id !== '')}
              onSelect={(imageIds) => {
                const selectedImages = imageIds.slice(0, 4).map(id => {
                  const image = formData.images.find(img => img.id === id);
                  return image?.url;
                }).filter(Boolean) as string[];
                onFieldChange('gridImages', selectedImages);
              }}
              buttonText=""
              buttonIcon={<Plus className="h-4 w-4" />}
              maxSelect={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
