
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { PropertyFormData } from "@/types/property";

interface MapImageUploadProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function MapImageUpload({ formData, onFieldChange }: MapImageUploadProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
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

  return (
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
          
          input.onchange = (e) => {
            if (e && e.target) {
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
  );
}
