
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { Floorplan } from "./technical-data/FloorplanUpload";

interface ImagesStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAreaPhoto?: (index: number) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: keyof Floorplan, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
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
  handleUpdateFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  isUploading
}: ImagesStepProps) {
  // Helper function to safely get the URL from an image
  const getImageUrl = (image: any): string => {
    if (typeof image === 'string') return image;
    if (image && typeof image === 'object' && 'url' in image) return image.url;
    return '';
  };
  
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
                {formData.images.map((image, index) => {
                  const imageUrl = getImageUrl(image);
                  return (
                    <ImagePreview
                      key={index}
                      url={imageUrl}
                      onRemove={() => handleRemoveImage && handleRemoveImage(index)}
                      isFeatured={formData.featuredImage === imageUrl}
                      onSetFeatured={handleSetFeaturedImage ? () => handleSetFeaturedImage(imageUrl) : undefined}
                      isInFeatured={formData.featuredImages?.includes(imageUrl)}
                      onToggleFeatured={handleToggleFeaturedImage ? () => handleToggleFeaturedImage(imageUrl) : undefined}
                    />
                  );
                })}
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
                {formData.areaPhotos.map((photo, index) => {
                  const photoUrl = getImageUrl(photo);
                  return (
                    <ImagePreview
                      key={index}
                      url={photoUrl}
                      onRemove={() => handleRemoveAreaPhoto && handleRemoveAreaPhoto(index)}
                    />
                  );
                })}
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
                {formData.floorplans.map((floorplan, index) => {
                  const floorplanUrl = getImageUrl(floorplan);
                  return (
                    <ImagePreview
                      key={index}
                      url={floorplanUrl}
                      onRemove={() => handleRemoveFloorplan && handleRemoveFloorplan(index)}
                      label={typeof floorplan === 'object' && floorplan.title ? floorplan.title : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
