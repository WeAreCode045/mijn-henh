
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GenerateAreasButton } from "./GenerateAreasButton";
import { PropertyFormData, PropertyArea } from "@/types/property";

interface PropertyAreasHeaderProps {
  onAdd: () => void;
  propertyData?: PropertyFormData;
  onAreasGenerated?: (newAreas: PropertyArea[]) => void;
}

export function PropertyAreasHeader({ 
  onAdd, 
  propertyData,
  onAreasGenerated 
}: PropertyAreasHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Property Areas</h3>
      
      <div className="flex gap-2">
        {propertyData && onAreasGenerated && (
          <GenerateAreasButton 
            propertyData={propertyData} 
            onAreasGenerated={onAreasGenerated} 
          />
        )}
        
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Area
        </Button>
      </div>
    </div>
  );
}
