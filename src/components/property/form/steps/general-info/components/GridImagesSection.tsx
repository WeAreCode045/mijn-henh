
import { Label } from "@/components/ui/label";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface GridImagesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GridImagesSection({ 
  formData, 
  onFieldChange 
}: GridImagesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleRemoveGridImage = (indexToRemove: number) => {
    console.log("Removing grid image at index:", indexToRemove);
    const updatedGridImages = formData.gridImages.filter((_, index) => index !== indexToRemove);
    onFieldChange('gridImages', updatedGridImages);
  };

  const handleSelectGridImages = (imageIds: string[]) => {
    console.log("Selected grid image IDs:", imageIds);
    const selectedImages = imageIds.slice(0, 4).map(id => {
      const image = formData.images.find(img => img.id === id);
      return image?.url;
    }).filter(Boolean) as string[];
    
    onFieldChange('gridImages', selectedImages);
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
            onRemove={() => handleRemoveGridImage(index)}
            onOpenDialog={() => setIsDialogOpen(true)}
          />
        ))}
      </div>
      
      {/* Show a select button below the grid */}
      <div className="mt-2 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => setIsDialogOpen(true)}
          disabled={isGridFull && !formData.gridImages.some(img => img !== null)}
        >
          {isGridFull ? "Modify Grid Images" : "Select Grid Images"}
        </Button>
      </div>
      
      <ImageSelectDialog
        images={formData.images || []}
        selectedImageIds={(formData.gridImages || []).map(url => 
          formData.images.find(img => img.url === url)?.id || ''
        ).filter(id => id !== '')}
        onSelect={handleSelectGridImages}
        buttonText="Select Grid Images"
        maxSelect={4}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

interface GridImageItemProps {
  imageUrl: string | null;
  index: number;
  onRemove: () => void;
  onOpenDialog: () => void;
}

function GridImageItem({
  imageUrl,
  index,
  onRemove,
  onOpenDialog
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
                    onClick={onRemove}
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
                  <Button
                    variant="default"
                    size="icon"
                    onClick={onOpenDialog}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change images</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (
        // Empty grid cell
        <div className="w-full h-full flex flex-col justify-center items-center p-2 cursor-pointer" onClick={onOpenDialog}>
          <Plus className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center">Add Grid Image</span>
        </div>
      )}
    </div>
  );
}
