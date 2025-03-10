
import { PropertyArea, PropertyFeature, PropertyFloorplan, PropertyFormData } from "@/types/property";
import { ReactNode } from "react";

interface PropertyStepContentProps {
  step: number;
  children: ReactNode;
  formData?: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload?: (id: string, files: FileList) => void;
  onAreaImageRemove?: (id: string, imageId: string) => void;
  onAreaImagesSelect?: (id: string, imageIds: string[]) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleRemoveAreaPhoto?: (index: number) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
}

export function PropertyStepContent({ children, step }: PropertyStepContentProps) {
  return (
    <div className="py-4 animate-fadeIn">
      {children}
    </div>
  );
}
