
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";

interface GridImagesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GridImagesSection({ 
  formData, 
  onFieldChange 
}: GridImagesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const gridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
  
  // Convert URLs to image IDs for the dialog
  const selectedImageIds = gridImages
    .map(url => formData.images.find(img => img.url === url)?.id || '')
    .filter(id => id !== '');

  const handleImagesSelect = (selectedIds: string[]) => {
    // Map selected IDs back to URLs
    const selectedUrls = selectedIds
      .map(id => formData.images.find(img => img.id === id)?.url || '')
      .filter(url => url !== '');
    
    onFieldChange('gridImages', selectedUrls);
  };

  const handleRemoveImage = (url: string) => {
    const updatedGridImages = gridImages.filter(gridUrl => gridUrl !== url);
    onFieldChange('gridImages', updatedGridImages);
  };

  return (
    <div>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Grid Images (Max 4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {gridImages.map((url, index) => (
              <div key={`grid-${index}`} className="relative group">
                <img 
                  src={url} 
                  alt={`Grid image ${index + 1}`} 
                  className="w-full h-24 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(url)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {gridImages.length < 4 && (
              <div 
                className="flex flex-col items-center justify-center h-24 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-8 w-8 text-muted-foreground mb-1" />
                <p className="text-muted-foreground text-xs">Add Grid Image</p>
              </div>
            )}
          </div>
          
          {gridImages.length === 0 && (
            <div 
              className="flex flex-col items-center justify-center h-48 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors mt-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Grid3X3 className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Select Grid Images (Max 4)</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageSelectDialog
        images={formData.images || []}
        selectedImageIds={selectedImageIds}
        onSelect={handleImagesSelect}
        buttonText="Select Grid Images"
        maxSelect={4}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
