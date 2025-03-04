
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ImagePreview } from "@/components/ui/ImagePreview";

interface ImagesStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (index: number) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
  isUploading?: boolean;
}

export function ImagesStep({
  formData,
  handleImageUpload,
  handleRemoveImage,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  isUploading
}: ImagesStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Main Property Images</Label>
            {handleImageUpload && (
              <ImageUploader 
                onUpload={handleImageUpload} 
                isUploading={isUploading}
                label="Upload Main Images"
              />
            )}
            
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <ImagePreview
                    key={index}
                    url={image.url}
                    onRemove={() => handleRemoveImage && handleRemoveImage(index)}
                    isFeatured={formData.featuredImage === image.url}
                    onSetFeatured={handleSetFeaturedImage ? () => handleSetFeaturedImage(image.url) : undefined}
                    isInGrid={formData.gridImages?.includes(image.url)}
                    onToggleGrid={handleToggleGridImage ? () => handleToggleGridImage(image.url) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Area Photos</Label>
            {handleAreaPhotosUpload && (
              <ImageUploader 
                onUpload={handleAreaPhotosUpload} 
                isUploading={isUploading}
                label="Upload Area Photos"
              />
            )}
            
            {formData.areaPhotos && formData.areaPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.areaPhotos.map((photo, index) => (
                  <ImagePreview
                    key={index}
                    url={typeof photo === 'string' ? photo : photo.url}
                    onRemove={() => handleRemoveAreaPhoto && handleRemoveAreaPhoto(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Floorplans</Label>
            {handleFloorplanUpload && (
              <ImageUploader 
                onUpload={handleFloorplanUpload} 
                isUploading={isUploading}
                label="Upload Floorplans"
              />
            )}
            
            {formData.floorplans && formData.floorplans.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.floorplans.map((floorplan, index) => (
                  <ImagePreview
                    key={index}
                    url={typeof floorplan === 'string' ? floorplan : floorplan.url}
                    onRemove={() => handleRemoveFloorplan && handleRemoveFloorplan(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
