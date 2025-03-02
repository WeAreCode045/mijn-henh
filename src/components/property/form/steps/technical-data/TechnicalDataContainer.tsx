
import React from "react";
import { PropertyFormData, PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { MapImageUpload } from "./components/MapImageUpload";
import { CoordinatesInput } from "./components/CoordinatesInput";
import { TechnicalItemsList } from "./components/TechnicalItemsList";

interface TechnicalDataContainerProps {
  formData?: PropertyFormData;
  technicalItems?: PropertyTechnicalItem[];
  floorplans?: PropertyFloorplan[];
  images?: any[];
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function TechnicalDataContainer({
  formData,
  technicalItems = [],
  floorplans = [],
  onFieldChange,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem
}: TechnicalDataContainerProps) {
  // Use either directly provided props or extract from formData
  const items = technicalItems.length > 0 ? technicalItems : (formData?.technicalItems || []);
  const availableFloorplans = floorplans.length > 0 ? floorplans : (formData?.floorplans || []);
  
  // Prevent default behavior which might cause redirection
  const handleAddItem = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onAddTechnicalItem) {
      onAddTechnicalItem();
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Map Image Upload - Only show if formData is available */}
      {formData && onFieldChange && (
        <MapImageUpload formData={formData} onFieldChange={onFieldChange} />
      )}

      {/* Latitude and Longitude Inputs - Only show if formData is available */}
      {formData && onFieldChange && (
        <CoordinatesInput formData={formData} onFieldChange={onFieldChange} />
      )}

      {/* Technical Items */}
      <TechnicalItemsList
        items={items}
        floorplans={availableFloorplans}
        onAdd={handleAddItem}
        onRemove={onRemoveTechnicalItem || (() => {})}
        onUpdate={onUpdateTechnicalItem || (() => {})}
      />
    </div>
  );
}
