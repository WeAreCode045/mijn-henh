
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface ConstructionStepProps {
  formData: PropertyFormData;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (index: number) => void;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  floorplans: string[] | { url: string }[];
}

export function ConstructionStep({
  formData,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onFieldChange,
  floorplans
}: ConstructionStepProps) {
  const [technicalItems, setTechnicalItems] = useState(formData.technicalItems || []);

  // Update local state when formData changes
  useEffect(() => {
    setTechnicalItems(formData.technicalItems || []);
  }, [formData.technicalItems]);

  const handleAddItem = () => {
    console.log("Add item button clicked");
    if (onAddTechnicalItem) {
      onAddTechnicalItem();
    } else {
      console.warn("onAddTechnicalItem function is not defined");
    }
  };

  const handleRemoveItem = (index: number) => {
    console.log("Remove item button clicked for index:", index);
    if (onRemoveTechnicalItem) {
      onRemoveTechnicalItem(index);
    } else {
      console.warn("onRemoveTechnicalItem function is not defined");
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...technicalItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onFieldChange('technicalItems', updatedItems);
  };

  // Ensure floorplans is always an array
  const normalizedFloorplans = floorplans || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Construction Details</h2>
        <Button 
          onClick={handleAddItem} 
          type="button" 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      {(!technicalItems || technicalItems.length === 0) ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500">No construction items added yet. Click 'Add Item' to begin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {technicalItems.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <h3 className="font-medium">Construction Item {index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveItem(index)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={item.title || ''}
                    onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                    placeholder="e.g., Foundation, Roofing, Walls"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <Input
                    value={item.size || ''}
                    onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                    placeholder="e.g., 100 sq.m, 10x15m"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Describe the construction element..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Link to Floorplan</label>
                  <Select
                    value={item.floorplanId || ''}
                    onValueChange={(value) => handleItemChange(index, 'floorplanId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a floorplan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {normalizedFloorplans.map((floorplan, fpIndex) => {
                        const url = typeof floorplan === 'string' ? floorplan : floorplan.url;
                        return (
                          <SelectItem key={`floorplan-${fpIndex}`} value={url || ''}>
                            Floorplan {fpIndex + 1}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
