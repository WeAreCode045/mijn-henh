
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyTechnicalItem } from "@/types/property";
import { PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TechnicalDataFormProps {
  technicalItems: PropertyTechnicalItem[];
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function TechnicalDataForm({
  technicalItems = [],
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
}: TechnicalDataFormProps) {
  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddTechnicalItem?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {technicalItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No technical specifications added. Click the button below to add specifications.
          </div>
        ) : (
          technicalItems.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Technical Item {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveTechnicalItem?.(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`item-title-${item.id}`}>Title</Label>
                  <Input
                    id={`item-title-${item.id}`}
                    value={item.title || ""}
                    onChange={(e) => onUpdateTechnicalItem?.(item.id, "title", e.target.value)}
                    placeholder="e.g., Kitchen, Bathroom, Bedroom"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`item-size-${item.id}`}>Size</Label>
                  <Input
                    id={`item-size-${item.id}`}
                    value={item.size || ""}
                    onChange={(e) => onUpdateTechnicalItem?.(item.id, "size", e.target.value)}
                    placeholder="e.g., 20 m²"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`item-description-${item.id}`}>Description</Label>
                <Textarea
                  id={`item-description-${item.id}`}
                  value={item.description || ""}
                  onChange={(e) => onUpdateTechnicalItem?.(item.id, "description", e.target.value)}
                  placeholder="Describe this area..."
                  className="mt-1 resize-y"
                  rows={3}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={handleAddItem}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Technical Item
        </Button>
      </CardFooter>
    </Card>
  );
}
