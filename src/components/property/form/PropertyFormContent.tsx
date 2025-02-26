
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyAreas } from "@/components/property/PropertyAreas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";

interface PropertyFormContentProps {
  step: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyFormData["areas"][0], value: string | string[]) => void;
  onAreaImageUpload: (id: string, files: FileList) => void;
  onAreaImageRemove: (id: string, imageId: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete: () => Promise<void>;
}

export function PropertyFormContent({
  step,
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
}: PropertyFormContentProps) {

  const renderStepContent = () => {
    switch (step) {
      case 1: // General Info
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => onFieldChange('title', e.target.value)}
                  placeholder="Title"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => onFieldChange('price', e.target.value)}
                  placeholder="Price"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => onFieldChange('address', e.target.value)}
                  placeholder="Address"
                />
              </div>
              <div>
                <Label htmlFor="object_id">Object ID</Label>
                <Input
                  id="object_id"
                  type="text"
                  value={formData.object_id || ''}
                  onChange={(e) => onFieldChange('object_id', e.target.value)}
                  placeholder="Object ID"
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => onFieldChange('bedrooms', e.target.value)}
                  placeholder="Number of bedrooms"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => onFieldChange('bathrooms', e.target.value)}
                  placeholder="Number of bathrooms"
                />
              </div>
              <div>
                <Label htmlFor="sqft">Lot Size (sqft)</Label>
                <Input
                  id="sqft"
                  type="text"
                  value={formData.sqft}
                  onChange={(e) => onFieldChange('sqft', e.target.value)}
                  placeholder="Lot size in square feet"
                />
              </div>
              <div>
                <Label htmlFor="livingArea">Living Area (sqft)</Label>
                <Input
                  id="livingArea"
                  type="text"
                  value={formData.livingArea}
                  onChange={(e) => onFieldChange('livingArea', e.target.value)}
                  placeholder="Living area in square feet"
                />
              </div>
              <div>
                <Label htmlFor="buildYear">Build Year</Label>
                <Input
                  id="buildYear"
                  type="text"
                  value={formData.buildYear}
                  onChange={(e) => onFieldChange('buildYear', e.target.value)}
                  placeholder="Year built"
                />
              </div>
              <div>
                <Label htmlFor="energyLabel">Energy Label</Label>
                <Input
                  id="energyLabel"
                  type="text"
                  value={formData.energyLabel}
                  onChange={(e) => onFieldChange('energyLabel', e.target.value)}
                  placeholder="Energy label"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                placeholder="Description"
              />
            </div>

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
                    images={formData.images}
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
                  images={formData.images}
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
          </div>
        );
      case 2: // Features
        return (
          <div className="space-y-6">
            <PropertyFeatures
              features={formData.features}
              onAdd={onAddFeature}
              onRemove={onRemoveFeature}
              onUpdate={onUpdateFeature}
            />
          </div>
        );
      case 3: // Areas
        return (
          <PropertyAreas
            areas={formData.areas}
            images={formData.images}
            onAdd={onAddArea}
            onRemove={onRemoveArea}
            onUpdate={onUpdateArea}
            onImageUpload={onAreaImageUpload}
            onImageRemove={onAreaImageRemove}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
}
