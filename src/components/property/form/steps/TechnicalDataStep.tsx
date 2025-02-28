import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PropertyFormData, PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TechnicalDataStepProps {
  formData?: PropertyFormData;
  technicalItems?: PropertyTechnicalItem[];
  floorplans?: PropertyFloorplan[];
  images?: any[]; // Allow images to be passed directly
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function TechnicalDataStep({
  formData,
  technicalItems = [],
  floorplans = [],
  images = [],
  onFieldChange,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan
}: TechnicalDataStepProps) {
  // Use either directly provided props or extract from formData
  const items = technicalItems.length > 0 ? technicalItems : (formData?.technicalItems || []);
  const availableFloorplans = floorplans.length > 0 ? floorplans : (formData?.floorplans || []);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (!onFieldChange || !formData) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onFieldChange('map_image', event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTechnicalItem = () => {
    if (onAddTechnicalItem) {
      onAddTechnicalItem();
    }
  };

  const handleRemoveTechnicalItem = (id: string) => {
    if (onRemoveTechnicalItem) {
      onRemoveTechnicalItem(id);
    }
  };

  const handleUpdateTechnicalItem = (id: string, field: keyof PropertyTechnicalItem, value: any) => {
    if (onUpdateTechnicalItem) {
      onUpdateTechnicalItem(id, field, value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Image Upload - Only show if formData is available */}
      {formData && onFieldChange && (
        <div>
          <Label htmlFor="map_image">Map Image</Label>
          {formData.map_image ? (
            <div className="relative w-64 h-40 rounded-md overflow-hidden">
              <img
                src={formData.map_image}
                alt="Map Preview"
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onFieldChange('map_image', null)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              
              // Fix: Use a proper type assertion to handle the event correctly
              input.onchange = (e) => {
                if (e && e.target) {
                  // Create a new synthetic React event to match the expected type
                  const syntheticEvent = {
                    target: e.target as HTMLInputElement
                  } as React.ChangeEvent<HTMLInputElement>;
                  
                  handleFileSelect(syntheticEvent);
                }
              };
              input.click();
            }}>
              Upload Map Image
            </Button>
          )}
        </div>
      )}

      {/* Latitude and Longitude Inputs - Only show if formData is available */}
      {formData && onFieldChange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              type="number"
              id="latitude"
              value={formData.latitude || ''}
              onChange={(e) => onFieldChange('latitude', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              type="number"
              id="longitude"
              value={formData.longitude || ''}
              onChange={(e) => onFieldChange('longitude', parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Technical Items */}
      <div>
        <Label>Technical Items</Label>
        {items && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`title-${item.id}`}>Title</Label>
                    <Input
                      type="text"
                      id={`title-${item.id}`}
                      value={item.title || ''}
                      onChange={(e) => handleUpdateTechnicalItem(item.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`size-${item.id}`}>Size</Label>
                    <Input
                      type="text"
                      id={`size-${item.id}`}
                      value={item.size || ''}
                      onChange={(e) => handleUpdateTechnicalItem(item.id, 'size', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description || ''}
                    onChange={(e) => handleUpdateTechnicalItem(item.id, 'description', e.target.value)}
                  />
                </div>
                
                {/* Floorplan Select */}
                {availableFloorplans && availableFloorplans.length > 0 && (
                  <div className="mt-2">
                    <Label htmlFor={`floorplan-${item.id}`}>Floorplan</Label>
                    <Select 
                      onValueChange={(value) => handleUpdateTechnicalItem(item.id, 'floorplanId', value)}
                      defaultValue={item.floorplanId || "none"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a floorplan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Floorplan</SelectItem>
                        {availableFloorplans.map((_, index) => (
                          <SelectItem key={index} value={index.toString()}>{`Floorplan ${index + 1}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleRemoveTechnicalItem(item.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No technical items added yet.</p>
        )}
        <Button variant="outline" className="mt-2" onClick={handleAddTechnicalItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Technical Item
        </Button>
      </div>
    </div>
  );
}
