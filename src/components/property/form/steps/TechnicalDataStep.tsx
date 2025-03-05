
import React from "react";
import { PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { TechnicalDataContainer } from "./technical-data/TechnicalDataContainer";
import { Floorplan } from "./technical-data/FloorplanUpload";

interface TechnicalDataStepProps {
  formData?: PropertyFormData;
  technicalItems?: PropertyTechnicalItem[];
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof Floorplan, value: any) => void;
  isUploading?: boolean;
}

export function TechnicalDataStep(props: TechnicalDataStepProps) {
  return <TechnicalDataContainer {...props} />;
}
