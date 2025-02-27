
import { Label } from "@/components/ui/label";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";

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
  return (
    <div className="space-y-4">
      <div>
        <Label>Featured Image</Label>
        <div className="flex items-center gap-4 mt-2">
          {formData.featuredImage && (
            <img 
              src={formData.featuredImage} 
              alt="Featured" 
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <ImageSelectDialog
            images={formData.images || []}
            selectedImageIds={formData.featuredImage ? [formData.images.find(img => img.url === formData.featuredImage)?.id || ''] : []}
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
      </div>

      <div>
        <Label>Grid Images</Label>
        <div className="grid grid-cols-4 gap-4 mt-2">
          {formData.gridImages?.map((url) => (
            <img 
              key={url}
              src={url}
              alt="Grid"
              className="w-full aspect-square object-cover rounded-lg"
            />
          ))}
        </div>
        <ImageSelectDialog
          images={formData.images || []}
          selectedImageIds={(formData.gridImages || []).map(url => 
            formData.images.find(img => img.url === url)?.id || ''
          ).filter(id => id !== '')}
          onSelect={(imageIds) => {
            const selectedImages = imageIds.map(id => {
              const image = formData.images.find(img => img.id === id);
              return image?.url;
            }).filter(Boolean) as string[];
            onFieldChange('gridImages', selectedImages);
          }}
          buttonText="Select Grid Images"
        />
      </div>
    </div>
  );
}
